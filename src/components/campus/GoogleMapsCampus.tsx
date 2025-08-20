import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapsCampusProps {
  onLocationSelect?: (location: CampusLocation) => void;
  selectedLocation?: string;
  selectedGooglePlace?: { placeId: string; name: string; formatted_address?: string; location: { lat: number; lng: number } };
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
  onLocationSelect,
  selectedLocation,
  selectedGooglePlace,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const googlePlaceMarkerRef = useRef<google.maps.Marker | null>(null);
  const placesServiceRef = useRef<any>(null);
  const streetViewServiceRef = useRef<any>(null);
  const streetViewPanoramaRef = useRef<any>(null);
  const streetViewContainerRef = useRef<HTMLDivElement | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentMapType, setCurrentMapType] = useState<google.maps.MapTypeId>(google.maps.MapTypeId.SATELLITE);
  const [placeDetailsCache, setPlaceDetailsCache] = useState<Record<string, any>>({});
  const [googlePlaceDetailsCache, setGooglePlaceDetailsCache] = useState<Record<string, any>>({});
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const [streetViewAvailable, setStreetViewAvailable] = useState(false);

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

    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Init PlacesService (guard if Places library not present)
    try {
      const g: any = window.google;
      if (g?.maps?.places?.PlacesService && mapInstance.current) {
        placesServiceRef.current = new g.maps.places.PlacesService(mapInstance.current);
      } else {
        placesServiceRef.current = null;
        console.warn('Google Places library not available or rate-limited. Skipping PlacesService init.');
      }
    } catch (e) {
      placesServiceRef.current = null;
      console.warn('Failed to init PlacesService:', e);
    }

    // Init Street View Service and Panorama (hidden by default) with guards
    try {
      const g: any = window.google;
      if (g?.maps?.StreetViewService) {
        streetViewServiceRef.current = new g.maps.StreetViewService();
      } else {
        streetViewServiceRef.current = null;
      }
      if (streetViewContainerRef.current && g?.maps?.StreetViewPanorama) {
        streetViewPanoramaRef.current = new g.maps.StreetViewPanorama(
          streetViewContainerRef.current,
          {
            pov: { heading: 0, pitch: 0 },
            zoom: 1,
            addressControl: true,
            fullscreenControl: true,
            motionTracking: false,
            visible: false,
          }
        );
      }
    } catch (e) {
      streetViewServiceRef.current = null;
      streetViewPanoramaRef.current = null;
      console.warn('Failed to init Street View:', e);
    }

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

  // All routing logic removed — OSRM handles navigation externally

  // Highlight selected location
  useEffect(() => {
    if (!selectedLocation || !mapInstance.current) return;

    const location = campusLocations.find(loc => loc.id === selectedLocation);
    if (location) {
      mapInstance.current.panTo(location.coordinates);
      mapInstance.current.setZoom(18);
    }
  }, [selectedLocation]);

  // When a Google Place is selected via Autocomplete
  useEffect(() => {
    if (!mapInstance.current) return;
    if (!selectedGooglePlace) return;

    const { location, name, formatted_address } = selectedGooglePlace;
    // Center map
    mapInstance.current.panTo(location);
    mapInstance.current.setZoom(18);

    // Create or update a dedicated marker for Google Place
    if (!googlePlaceMarkerRef.current) {
      googlePlaceMarkerRef.current = new window.google.maps.Marker({
        position: location,
        map: mapInstance.current,
        title: name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        label: { text: name?.split(' ')?.[0] ?? 'Place', color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }
      });
    } else {
      googlePlaceMarkerRef.current.setMap(mapInstance.current);
      (googlePlaceMarkerRef.current as any).setPosition(location);
      (googlePlaceMarkerRef.current as any).setTitle(name);
    }

    // Show info window
    if (infoWindowRef.current && googlePlaceMarkerRef.current) {
      const content = `
        <div class="p-2">
          <h3 class="font-semibold text-lg">${name}</h3>
          ${formatted_address ? `<p class="text-sm text-gray-600">${formatted_address}</p>` : ''}
        </div>
      `;
      infoWindowRef.current.setContent(content);
      infoWindowRef.current.open(mapInstance.current, googlePlaceMarkerRef.current);
    }
  }, [selectedGooglePlace]);

  // Fetch rich details for selected Google Place using Places API v1
  useEffect(() => {
    const fetchJsOrHttpDetails = async () => {
      if (!selectedGooglePlace) return;
      const pid = selectedGooglePlace.placeId;
      if (!pid) return;
      if (googlePlaceDetailsCache[pid]) return;

      const g: any = window.google;
      // Prefer JS PlacesService if available
      if (placesServiceRef.current && g?.maps?.places) {
        try {
          await new Promise<void>((resolve) => {
            const service: any = placesServiceRef.current;
            service.getDetails(
              {
                placeId: pid,
                fields: ['place_id','name','rating','user_ratings_total','formatted_address','url','photos']
              },
              (result: any, status: any) => {
                if (status === g.maps.places.PlacesServiceStatus.OK && result) {
                  const photoUrl = result.photos?.[0]?.getUrl?.({ maxWidth: 520, maxHeight: 260 }) ?? null;
                  const normalized = {
                    name: result.name ?? selectedGooglePlace.name,
                    formatted_address: result.formatted_address,
                    rating: result.rating,
                    user_ratings_total: result.user_ratings_total,
                    url: result.url,
                    photos: result.photos,
                    __photoUrl: photoUrl,
                    __raw: result,
                  } as any;
                  setGooglePlaceDetailsCache(prev => ({ ...prev, [pid]: normalized }));
                } else {
                  console.warn('PlacesService.getDetails non-OK status', { status, pid });
                }
                resolve();
              }
            );
          });
          return; // JS path handled
        } catch (e) {
          console.warn('JS PlacesService.getDetails failed, falling back to v1', e);
        }
      }

      // Fallback: Places API v1 HTTP (use lookupPlaceId to convert legacy place_id to v1 resource name)
      const apiKey = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
      if (!apiKey) return;
      try {
        // Step 1: Lookup v1 resource name from legacy place_id
        const lookupUrl = new URL('https://places.googleapis.com/v1/places:lookupPlaceId');
        lookupUrl.searchParams.set('placeId', pid);
        lookupUrl.searchParams.set('key', apiKey);
        const lookupResp = await fetch(lookupUrl.toString());
        if (!lookupResp.ok) throw new Error(`lookupPlaceId failed: ${lookupResp.status}`);
        const lookupData = await lookupResp.json();
        const resourceName: string | undefined = lookupData?.name; // e.g., "places/XXXX"
        if (!resourceName) throw new Error('lookupPlaceId returned no resource name');

        // Step 2: Fetch details for the v1 resource name
        const fields = [
          'id','displayName','formattedAddress','rating','userRatingCount','location','photos','googleMapsUri','editorialSummary'
        ].join(',');
        const detailsUrl = new URL(`https://places.googleapis.com/v1/${resourceName}`);
        detailsUrl.searchParams.set('fields', fields);
        detailsUrl.searchParams.set('key', apiKey);
        const resp = await fetch(detailsUrl.toString());
        if (!resp.ok) throw new Error(`Places details failed: ${resp.status}`);
        const place = await resp.json();

        let photoUrl: string | null = null;
        const photoName = place?.photos?.[0]?.name;
        if (photoName) {
          const u = new URL(`https://places.googleapis.com/v1/${photoName}/media`);
          u.searchParams.set('maxWidthPx', '520');
          u.searchParams.set('maxHeightPx', '260');
          u.searchParams.set('key', apiKey);
          photoUrl = u.toString();
        }
        const normalized = {
          name: place?.displayName?.text ?? selectedGooglePlace.name,
          formatted_address: place?.formattedAddress,
          rating: place?.rating,
          user_ratings_total: place?.userRatingCount,
          googleMapsUri: place?.googleMapsUri,
          editorialSummary: place?.editorialSummary?.text,
          __photoUrl: photoUrl,
          __raw: place,
        } as any;
        setGooglePlaceDetailsCache(prev => ({ ...prev, [pid]: normalized }));
      } catch (e) {
        console.warn('Places API v1 fallback failed', e);
      }
    };

    fetchJsOrHttpDetails();
  }, [selectedGooglePlace, googlePlaceDetailsCache]);

  // Fetch Google Places details for selected location using Places API (New)
  useEffect(() => {
    const fetchNewPlaces = async () => {
      if (!selectedLocation) return;
      if (placeDetailsCache[selectedLocation]) return;
      const loc = campusLocations.find(l => l.id === selectedLocation);
      if (!loc) return;

      const apiKey = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
      if (!apiKey) return;

      try {
        // Text Search (New)
        const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.photos'
          },
          body: JSON.stringify({
            textQuery: `${loc.name} Manipal University Jaipur`,
            locationBias: {
              circle: {
                center: { latitude: loc.coordinates.lat, longitude: loc.coordinates.lng },
                radius: 2000
              }
            }
          })
        });
        const data = await resp.json();
        const place = data?.places?.[0];
        if (!place) return;

        // Prepare a normalized details object compatible with UI
        let photoUrl: string | null = null;
        const photoName = place.photos?.[0]?.name; // e.g., "places/XYZ/photos/ABC"
        if (photoName) {
          const u = new URL(`https://places.googleapis.com/v1/${photoName}/media`);
          u.searchParams.set('maxWidthPx', '400');
          u.searchParams.set('maxHeightPx', '200');
          u.searchParams.set('key', apiKey);
          photoUrl = u.toString();
        }

        const normalized = {
          // Legacy-compatible fields used by rendering code
          name: place.displayName?.text || loc.name,
          rating: place.rating,
          user_ratings_total: place.userRatingCount,
          formatted_address: place.formattedAddress,
          // Provide photoUrl directly for the UI
          __photoUrl: photoUrl,
          // Keep raw in case we expand later
          __raw: place,
        } as any;

        setPlaceDetailsCache(prev => ({ ...prev, [selectedLocation]: normalized }));
      } catch (e) {
        // Silently ignore to avoid UI noise
        console.warn('Places API (New) fetch failed', e);
      }
    };

    fetchNewPlaces();
  }, [selectedLocation, placeDetailsCache]);

  // Find and prepare Street View for selected location
  useEffect(() => {
    if (!selectedLocation || !streetViewServiceRef.current || !mapInstance.current) return;
    const loc = campusLocations.find(l => l.id === selectedLocation);
    if (!loc) return;

    const sv = streetViewServiceRef.current as any;
    sv.getPanorama({ location: loc.coordinates, radius: 70 }, (data: any, status: any) => {
      const ok = status === (window.google as any).maps.StreetViewStatus.OK && data;
      setStreetViewAvailable(!!ok);
      if (ok && streetViewPanoramaRef.current) {
        streetViewPanoramaRef.current.setPano(data.location.pano);
        streetViewPanoramaRef.current.setPov({ heading: 0, pitch: 0 });
        if (streetViewVisible) {
          streetViewPanoramaRef.current.setVisible(true);
        } else {
          streetViewPanoramaRef.current.setVisible(false);
        }
      } else if (streetViewPanoramaRef.current) {
        streetViewPanoramaRef.current.setVisible(false);
      }
    });
  }, [selectedLocation, streetViewVisible]);

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
            <MapPin className="h-4 w-4" />
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

        {/* Street View Toggle */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-1 shadow-lg">
          <Button
            variant={streetViewVisible ? 'default' : 'ghost'}
            size="sm"
            disabled={!streetViewAvailable}
            onClick={() => {
              const next = !streetViewVisible;
              setStreetViewVisible(next);
              if (streetViewPanoramaRef.current) {
                streetViewPanoramaRef.current.setVisible(next && streetViewAvailable);
              }
            }}
            className="h-8 px-2 text-xs"
            title={streetViewAvailable ? 'Toggle Street View' : 'Street View not available here'}
          >
            SV
          </Button>
        </div>
      </div>

      {/* Place Details Panel for campus locations */}
      {selectedLocation && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
          {(() => {
            const loc = campusLocations.find(l => l.id === selectedLocation);
            if (!loc) return null as any;
            const details = placeDetailsCache[selectedLocation];
            const photoUrl = details?.__photoUrl || (details?.photos?.[0]?.getUrl ? details.photos[0].getUrl({ maxWidth: 400, maxHeight: 200 }) : null);
            return (
              <div>
                {photoUrl && (
                  <div className="mb-3 overflow-hidden rounded-md">
                    <img src={photoUrl} alt={loc.name} className="w-full h-32 object-cover" />
                  </div>
                )}
                <div className="mb-2">
                  <h4 className="font-semibold text-lg">{loc.name}</h4>
                  <div className="text-xs text-muted-foreground capitalize">{loc.category}</div>
                </div>
                {details && (
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="font-medium">{details.rating?.toFixed?.(1) ?? '—'}</span>
                    <span className="text-yellow-500">{'★'.repeat(Math.round(details.rating || 0))}</span>
                    <span className="text-xs text-muted-foreground">({details.user_ratings_total ?? 0})</span>
                  </div>
                )}
                {loc.description && (
                  <p className="text-sm text-gray-700 mb-3">{loc.description}</p>
                )}
                {details?.formatted_address && (
                  <p className="text-xs text-muted-foreground mb-3">{details.formatted_address}</p>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loc.status === 'open' ? 'bg-green-100 text-green-800' :
                    loc.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{loc.status}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <Button variant="secondary" size="sm" onClick={() => {
                    // Center and drop bounce to highlight
                    if (mapInstance.current) {
                      mapInstance.current.panTo(loc.coordinates);
                      mapInstance.current.setZoom(18);
                    }
                  }}>Center here</Button>
                </div>
                {details?.url && (
                  <div className="mt-2">
                    <a href={details.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Place Details Panel for Google Autocomplete selection */}
      {selectedGooglePlace && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
          {(() => {
            const d = googlePlaceDetailsCache[selectedGooglePlace.placeId];
            const photoUrl = d?.__photoUrl || (d?.photos?.[0]?.getUrl ? d.photos[0].getUrl({ maxWidth: 400, maxHeight: 200 }) : null);
            return (
              <div>
                {photoUrl && (
                  <div className="mb-3 overflow-hidden rounded-md">
                    <img src={photoUrl} alt={selectedGooglePlace.name} className="w-full h-32 object-cover" />
                  </div>
                )}
                <div className="mb-2">
                  <h4 className="font-semibold text-lg">{d?.name ?? selectedGooglePlace.name}</h4>
                  {d?.formatted_address && (
                    <div className="text-xs text-muted-foreground">{d.formatted_address}</div>
                  )}
                </div>
                {typeof d?.rating === 'number' && (
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="font-medium">{d.rating.toFixed(1)}</span>
                    <span className="text-yellow-500">{'★'.repeat(Math.round(d.rating))}</span>
                    <span className="text-xs text-muted-foreground">({d.user_ratings_total ?? 0})</span>
                  </div>
                )}
                {d?.editorialSummary && (
                  <p className="text-sm text-gray-700 mb-3">{d.editorialSummary}</p>
                )}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <Button variant="secondary" size="sm" onClick={() => {
                    if (mapInstance.current) {
                      mapInstance.current.panTo(selectedGooglePlace.location);
                      mapInstance.current.setZoom(18);
                    }
                  }}>Center here</Button>
                </div>
                {(d?.url || d?.googleMapsUri) && (
                  <div className="mt-2">
                    <a href={d.url || d.googleMapsUri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
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
