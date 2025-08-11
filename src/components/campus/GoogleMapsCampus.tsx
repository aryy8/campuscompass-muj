import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
    routeInfo: {
      distance: string;
      duration: string;
      steps: google.maps.DirectionsStep[];
    };
  }
}

interface GoogleMapsCampusProps {
  startLocationId?: string;
  endLocationId?: string;
  onLocationSelect?: (location: CampusLocation) => void;
  selectedLocation?: string;
}

interface CampusLocation {
  id: string;
  name: string;
  category: 'academic' | 'dining' | 'hostels' | 'recreation' | 'admin' | 'medical';
  coordinates: { lat: number; lng: number };
  description?: string;
  status?: 'open' | 'closed' | 'maintenance';
}

// Campus locations with realistic coordinates for better route calculation
const campusLocations: CampusLocation[] = [
  { 
    id: '1', 
    name: 'Academic Block 1', 
    category: 'academic', 
    coordinates: { lat: 26.8431, lng: 75.5647 }, 
    status: 'open',
    description: 'Main academic building with lecture halls and classrooms'
  },
  { 
    id: '2', 
    name: 'Central Library', 
    category: 'academic', 
    coordinates: { lat: 26.8435, lng: 75.5650 }, 
    status: 'open',
    description: 'Central library with study spaces and digital resources'
  },
  { 
    id: '3', 
    name: 'Food Court', 
    category: 'dining', 
    coordinates: { lat: 26.8438, lng: 75.5645 }, 
    status: 'open',
    description: 'Main food court with multiple dining options'
  },
  { 
    id: '4', 
    name: 'Hostel A', 
    category: 'hostels', 
    coordinates: { lat: 26.8442, lng: 75.5655 }, 
    status: 'open',
    description: 'Student accommodation block A'
  },
  { 
    id: '5', 
    name: 'Hostel B', 
    category: 'hostels', 
    coordinates: { lat: 26.8445, lng: 75.5660 }, 
    status: 'open',
    description: 'Student accommodation block B'
  },
  { 
    id: '6', 
    name: 'Sports Complex', 
    category: 'recreation', 
    coordinates: { lat: 26.8428, lng: 75.5640 }, 
    status: 'open',
    description: 'Sports facilities and gymnasium'
  },
  { 
    id: '7', 
    name: 'Medical Center', 
    category: 'medical', 
    coordinates: { lat: 26.8433, lng: 75.5652 }, 
    status: 'open',
    description: 'Campus health center and medical services'
  },
  { 
    id: '8', 
    name: 'Admin Office', 
    category: 'admin', 
    coordinates: { lat: 26.8436, lng: 75.5648 }, 
    status: 'open',
    description: 'Administrative offices and student services'
  },
  { 
    id: '9', 
    name: 'Canteen', 
    category: 'dining', 
    coordinates: { lat: 26.8440, lng: 75.5643 }, 
    status: 'open',
    description: 'Quick service canteen and snack bar'
  },
  { 
    id: '10', 
    name: 'Gym', 
    category: 'recreation', 
    coordinates: { lat: 26.8425, lng: 75.5638 }, 
    status: 'maintenance',
    description: 'Fitness center and workout facilities'
  },
];

const categoryColors = {
  academic: '#1e40af',
  dining: '#ea580c',
  hostels: '#16a34a',
  recreation: '#7c3aed',
  admin: '#0891b2',
  medical: '#dc2626',
} as const;

const GoogleMapsCampus: React.FC<GoogleMapsCampusProps> = ({
  startLocationId,
  endLocationId,
  onLocationSelect,
  selectedLocation
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const center = { lat: 26.8431, lng: 75.5647 }; // MUJ center coordinates

    // Create map instance
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Initialize services
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#1e40af',
        strokeWeight: 6,
        strokeOpacity: 0.9,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            strokeColor: '#1e40af',
            fillColor: '#1e40af'
          },
          offset: '50%',
          repeat: '100px'
        }]
      }
    });

    console.log('Directions renderer created:', directionsRendererRef.current);
    directionsRendererRef.current.setMap(mapInstance.current);

    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow();

    setIsMapLoaded(true);
  }, []);

  // Create markers
  useEffect(() => {
    if (!mapInstance.current || !isMapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    campusLocations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: location.coordinates,
        map: mapInstance.current,
        title: location.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: categoryColors[location.category],
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        label: {
          text: location.name.split(' ')[0],
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: 'bold'
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          const content = `
            <div class="p-2">
              <h3 class="font-semibold text-lg">${location.name}</h3>
              <p class="text-sm text-gray-600 capitalize">${location.category}</p>
              ${location.description ? `<p class="text-sm text-gray-500 mt-1">${location.description}</p>` : ''}
              <div class="mt-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  location.status === 'open' ? 'bg-green-100 text-green-800' : 
                  location.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }">
                  ${location.status}
                </span>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstance.current, marker);
        }
        onLocationSelect?.(location);
      });

      markersRef.current.push(marker);
    });
  }, [isMapLoaded, onLocationSelect]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle directions
  useEffect(() => {
    console.log('Directions effect triggered:', { startLocationId, endLocationId });
    
    if (!startLocationId || !endLocationId) {
      console.log('No start or end location selected');
      return;
    }

    const startLocation = campusLocations.find(loc => loc.id === startLocationId);
    const endLocation = campusLocations.find(loc => loc.id === endLocationId);

    if (!startLocation || !endLocation) {
      console.log('Could not find start or end location');
      return;
    }

    console.log('Calculating route from', startLocation.name, 'to', endLocation.name);
    console.log('Start coordinates:', startLocation.coordinates);
    console.log('End coordinates:', endLocation.coordinates);

    // Calculate distance and estimated walking time
    const distance = calculateDistance(
      startLocation.coordinates.lat, 
      startLocation.coordinates.lng,
      endLocation.coordinates.lat, 
      endLocation.coordinates.lng
    );
    const walkingTime = Math.round(distance * 12); // ~12 minutes per km walking

    // Store route info for display
    window.routeInfo = {
      distance: `${(distance * 1000).toFixed(0)}m`,
      duration: `${walkingTime} min`,
      steps: []
    };

    // Clear any existing directions
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }

    // Create a custom route path since coordinates are close
    const routePath = [
      startLocation.coordinates,
      endLocation.coordinates
    ];

    // Calculate midpoint for a curved path
    const midLat = (startLocation.coordinates.lat + endLocation.coordinates.lat) / 2;
    const midLng = (startLocation.coordinates.lng + endLocation.coordinates.lng) / 2;
    
    // Add a slight curve to make the route more visible
    const curveOffset = 0.0001; // Small offset for visibility
    const curvedPath = [
      startLocation.coordinates,
      { lat: midLat + curveOffset, lng: midLng + curveOffset },
      endLocation.coordinates
    ];

    // Create a custom polyline for the route
    if (mapInstance.current) {
      // Remove existing route lines
      const existingLines = document.querySelectorAll('.custom-route-line');
      existingLines.forEach(line => line.remove());

      // Create new route line
      const routeLine = new window.google.maps.Polyline({
        path: curvedPath,
        geodesic: true,
        strokeColor: '#1e40af',
        strokeOpacity: 0.9,
        strokeWeight: 6,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            strokeColor: '#1e40af',
            fillColor: '#1e40af'
          },
          offset: '50%',
          repeat: '100px'
        }]
      });

      routeLine.setMap(mapInstance.current);
      routeLine.set('class', 'custom-route-line');

      // Fit map to show entire route
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(startLocation.coordinates);
      bounds.extend(endLocation.coordinates);
      mapInstance.current.fitBounds(bounds);

      console.log('Custom route line created and displayed');
    }
  }, [startLocationId, endLocationId]);

  // Highlight selected location
  useEffect(() => {
    if (!selectedLocation || !mapInstance.current) return;

    const location = campusLocations.find(loc => loc.id === selectedLocation);
    if (location) {
      mapInstance.current.panTo(location.coordinates);
      mapInstance.current.setZoom(18);
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-border shadow-lg">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (mapInstance.current) {
                mapInstance.current.setZoom(17);
                mapInstance.current.setCenter({ lat: 26.8431, lng: 75.5647 });
              }
            }}
            className="h-8 w-8"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Directions Info Panel */}
      {startLocationId && endLocationId && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2 text-blue-600">
            <Navigation className="h-4 w-4" />
            Walking Route
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">From:</span>
              <span className="font-medium">{campusLocations.find(l => l.id === startLocationId)?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">To:</span>
              <span className="font-medium">{campusLocations.find(l => l.id === endLocationId)?.name}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between items-center text-blue-600">
                <span>Distance:</span>
                <span className="font-medium">{window.routeInfo?.distance || 'Calculating...'}</span>
              </div>
              <div className="flex justify-between items-center text-blue-600">
                <span>Time:</span>
                <span className="font-medium">{window.routeInfo?.duration || 'Calculating...'}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>• Blue line shows the walking path</p>
                <p>• Arrows indicate direction of travel</p>
                <p>• Map automatically adjusts to show full route</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
        <h4 className="font-medium text-sm mb-2">Campus Locations</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsCampus;
export type { CampusLocation };
