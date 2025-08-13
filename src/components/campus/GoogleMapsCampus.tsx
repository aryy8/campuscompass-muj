import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateTimeBetweenLocations, type Location as TimeLocation } from '@/lib/time-calculator';

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
  {
    id: '11',
    name: 'B1',
    category: 'hostels',
    coordinates: { lat: 26.841461, lng: 75.562827 },
    status: 'open',
    description: 'Hostel block B1'
  },
  {
    id: '12',
    name: 'B2',
    category: 'hostels',
    coordinates: { lat: 26.841565, lng: 75.562756 },
    status: 'open',
    description: 'Hostel block B2'
  },
  {
    id: '13',
    name: 'B3',
    category: 'hostels',
    coordinates: { lat: 26.841792, lng: 75.562706 },
    status: 'open',
    description: 'Hostel block B3'
  },
  {
    id: '14',
    name: 'B4',
    category: 'hostels',
    coordinates: { lat: 26.841401, lng: 75.562684 },
    status: 'open',
    description: 'Hostel block B4'
  },
  {
    id: '15',
    name: 'B5',
    category: 'hostels',
    coordinates: { lat: 26.841476, lng: 75.562622 },
    status: 'open',
    description: 'Hostel block B5'
  },
  {
    id: '16',
    name: 'B6',
    category: 'hostels',
    coordinates: { lat: 26.841360, lng: 75.562576 },
    status: 'open',
    description: 'Hostel block B6'
  },
  {
    id: '17',
    name: 'B7',
    category: 'hostels',
    coordinates: { lat: 26.841332, lng: 75.562490 },
    status: 'open',
    description: 'Hostel block B7'
  },
  {
    id: '18',
    name: 'B8',
    category: 'hostels',
    coordinates: { lat: 26.841315, lng: 75.561746 },
    status: 'open',
    description: 'Hostel block B8'
  },
  {
    id: '19',
    name: 'G1',
    category: 'hostels',
    coordinates: { lat: 26.840927, lng: 75.563042 },
    status: 'open',
    description: 'Hostel block G1'
  },
  {
    id: '20',
    name: 'G2',
    category: 'hostels',
    coordinates: { lat: 26.840879, lng: 75.562884 },
    status: 'open',
    description: 'Hostel block G2'
  },
  {
    id: '21',
    name: 'G3',
    category: 'hostels',
    coordinates: { lat: 26.840819, lng: 75.562814 },
    status: 'open',
    description: 'Hostel block G3'
  },
  {
    id: '22',
    name: 'G4',
    category: 'hostels',
    coordinates: { lat: 26.840616, lng: 75.562636 },
    status: 'open',
    description: 'Hostel block G4'
  },
  {
    id: '23',
    name: 'G5',
    category: 'hostels',
    coordinates: { lat: 26.840484, lng: 75.562679 },
    status: 'open',
    description: 'Hostel block G5'
  },
  {
    id: '24',
    name: 'Cricket Ground',
    category: 'recreation',
    coordinates: { lat: 26.845316, lng: 75.564126 },
    status: 'open',
    description: 'Cricket ground with professional facilities'
  },
  {
    id: '25',
    name: 'grand stairs',
    category: 'recreation',
    coordinates: { lat: 26.842529, lng: 75.565437 },
    status: 'open',
    description: 'Grand stairs landmark'
  },
  {
    id: '26',
    name: 'AB 2',
    category: 'academic',
    coordinates: { lat: 26.842901, lng: 75.565910 },
    status: 'open',
    description: 'Academic Block 2'
  },
  {
    id: '27',
    name: 'AB 1',
    category: 'academic',
    coordinates: { lat: 26.842315, lng: 75.564995 },
    status: 'open',
    description: 'Academic Block 1 (AB 1)'
  },
  {
    id: '28',
    name: 'AB 4',
    category: 'academic',
    coordinates: { lat: 26.844088, lng: 75.564768 },
    status: 'open',
    description: 'Academic Block 4'
  },
  {
    id: '29',
    name: 'AB 3',
    category: 'academic',
    coordinates: { lat: 26.843668, lng: 75.564332 },
    status: 'open',
    description: 'Academic Block 3'
  },
  {
    id: '30',
    name: 'Vasanti Pai audi',
    category: 'academic',
    coordinates: { lat: 26.844027, lng: 75.563927 },
    status: 'open',
    description: 'Vasanti Pai Auditorium'
  },
  {
    id: '31',
    name: 'Sharda Pai audi',
    category: 'academic',
    coordinates: { lat: 26.843167, lng: 75.565822 },
    status: 'open',
    description: 'Sharda Pai Auditorium'
  },
  {
    id: '32',
    name: 'TMA Pai audi',
    category: 'academic',
    coordinates: { lat: 26.843374, lng: 75.566596 },
    status: 'open',
    description: 'TMA Pai Auditorium'
  },
  {
    id: '33',
    name: 'Old mess',
    category: 'dining',
    coordinates: { lat: 26.843100, lng: 75.565256 },
    status: 'open',
    description: 'Old mess dining area'
  },
  {
    id: '34',
    name: 'Blue spring',
    category: 'dining',
    coordinates: { lat: 26.841211, lng: 75.561601 },
    status: 'open',
    description: 'Blue Spring cafe'
  },
  {
    id: '35',
    name: 'Blue dove',
    category: 'dining',
    coordinates: { lat: 26.840427, lng: 75.561778 },
    status: 'open',
    description: 'Blue Dove restaurant'
  },
  {
    id: '36',
    name: 'Joggers park',
    category: 'recreation',
    coordinates: { lat: 26.840216, lng: 75.563530 },
    status: 'open',
    description: 'Joggers park'
  },
  {
    id: '37',
    name: 'Tandoor',
    category: 'dining',
    coordinates: { lat: 26.840884, lng: 75.563428 },
    status: 'open',
    description: 'Tandoor eatery'
  },
  {
    id: '38',
    name: 'Jaipur bakers',
    category: 'dining',
    coordinates: { lat: 26.840625, lng: 75.562656 },
    status: 'open',
    description: 'Jaipur Bakers'
  },
  {
    id: '39',
    name: 'Laundry',
    category: 'admin',
    coordinates: { lat: 26.840446, lng: 75.561480 },
    status: 'open',
    description: 'Laundry service'
  },
  {
    id: '40',
    name: 'GHS office',
    category: 'admin',
    coordinates: { lat: 26.840101, lng: 75.561351 },
    status: 'open',
    description: 'GHS Office'
  },
  {
    id: '41',
    name: 'Court',
    category: 'recreation',
    coordinates: { lat: 26.841908, lng: 75.561179 },
    status: 'open',
    description: 'Sports court'
  },
  {
    id: '42',
    name: 'Subway',
    category: 'dining',
    coordinates: { lat: 26.841623, lng: 75.563467 },
    status: 'open',
    description: 'Subway outlet'
  },
  {
    id: '43',
    name: 'cab rent',
    category: 'admin',
    coordinates: { lat: 26.841783, lng: 75.563341 },
    status: 'open',
    description: 'Cab rental point'
  },
  {
    id: '44',
    name: 'library',
    category: 'academic',
    coordinates: { lat: 26.841504, lng: 75.565341 },
    status: 'open',
    description: 'Library'
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
  const [currentMapType, setCurrentMapType] = useState<google.maps.MapTypeId>(google.maps.MapTypeId.SATELLITE);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const center = { lat: 26.8431, lng: 75.5647 }; // MUJ center coordinates

    // Create map instance
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
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

    // Set initial map type state
    setCurrentMapType(google.maps.MapTypeId.SATELLITE);

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

  // Enhanced time calculation using the new utility
  const calculateEnhancedTime = (startLoc: CampusLocation, endLoc: CampusLocation) => {
    const timeLocation: TimeLocation = {
      id: startLoc.id,
      name: startLoc.name,
      coordinates: startLoc.coordinates,
      category: startLoc.category,
      status: startLoc.status
    };
    
    const endTimeLocation: TimeLocation = {
      id: endLoc.id,
      name: endLoc.name,
      coordinates: endLoc.coordinates,
      category: endLoc.category,
      status: endLoc.status
    };
    
    return calculateTimeBetweenLocations(timeLocation, endTimeLocation);
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

    // Calculate enhanced time information
    const timeCalculation = calculateEnhancedTime(startLocation, endLocation);

    // Store route info for display
    window.routeInfo = {
      distance: timeCalculation.formattedDistance,
      duration: timeCalculation.formattedWalkingTime,
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
            title="Reset View"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Map Type Toggle */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (mapInstance.current) {
                const newMapType = currentMapType === google.maps.MapTypeId.SATELLITE 
                  ? google.maps.MapTypeId.ROADMAP 
                  : google.maps.MapTypeId.SATELLITE;
                mapInstance.current.setMapTypeId(newMapType);
                setCurrentMapType(newMapType);
              }
            }}
            className="h-8 w-8"
            title={`Switch to ${currentMapType === google.maps.MapTypeId.SATELLITE ? 'Road' : 'Satellite'} view`}
          >
            {currentMapType === google.maps.MapTypeId.SATELLITE ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Directions Info Panel */}
      {startLocationId && endLocationId && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm flex items-center gap-2 text-blue-600">
              <Navigation className="h-4 w-4" />
              Route Information
            </h4>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                currentMapType === google.maps.MapTypeId.SATELLITE 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}
            >
              {currentMapType === google.maps.MapTypeId.SATELLITE ? 'Satellite' : 'Road'}
            </Badge>
          </div>
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
                <span>Walking:</span>
                <span className="font-medium">{window.routeInfo?.duration || 'Calculating...'}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>• Blue line shows the walking path</p>
                <p>• Arrows indicate direction of travel</p>
                <p>• Check sidebar for detailed time options</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">Campus Locations</h4>
          <Badge 
            variant="outline" 
            className={`text-xs ${
              currentMapType === google.maps.MapTypeId.SATELLITE 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}
          >
            {currentMapType === google.maps.MapTypeId.SATELLITE ? 'Satellite' : 'Road'}
          </Badge>
        </div>
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
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
          <p>• Use the map toggle button to switch views</p>
          <p>• Satellite view shows real campus imagery</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsCampus;
export type { CampusLocation };
