// OSRM foot router endpoint (can be overridden via env)
const OSRM_FOOT_URL = (import.meta as any)?.env?.VITE_OSRM_FOOT_URL || 'https://router.project-osrm.org/route/v1';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, CircleMarker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './CampusMap.css';
import { CAMPUS_GRAPH, NODE_COORDS, isWithinCampus, nearestNodeId, SUBWAY_NODE_ID } from '../../lib/campus-graph';
import { dijkstra } from '../../lib/shortest-path';

// Define types for our POIs
export interface POI {
  id: number;
  name: string;
  category: string;
  position: [number, number];
  description?: string;
}

// Define categories and their colors
const CATEGORIES = {
  academic: { name: 'Academic', color: '#3b82f6', icon: '🏫' },
  hostel: { name: 'Hostel', color: '#ef4444', icon: '🏠' },
  food: { name: 'Food', color: '#f59e0b', icon: '🍽️' },
  sports: { name: 'Sports', color: '#10b981', icon: '⚽' },
  admin: { name: 'Administration', color: '#8b5cf6', icon: '🏢' },
  other: { name: 'Other', color: '#6b7280', icon: '📍' },
};

// POIs sourced from OpenStreetMap (Overpass) for MUJ campus and hostels area
const POIS: POI[] = [
  // Academic / Campus core
  { id: 1, name: 'Central Library', category: 'academic', position: [26.8415259, 75.5651891] },
  { id: 2, name: 'TMA Pai Auditorium', category: 'academic', position: [26.8433006, 75.5665613] },
  { id: 3, name: 'Sharda Pai Auditorium', category: 'academic', position: [26.8433339, 75.5657484] },
  { id: 4, name: 'Grand Staircase', category: 'other', position: [26.8425178, 75.5654901] },

  // Entrances / Landmarks
  { id: 10, name: 'University Entrance', category: 'other', position: [26.8415563, 75.5638571] },
  { id: 11, name: 'Hostel Entrance', category: 'other', position: [26.8415678, 75.5634519] },
  { id: 12, name: 'I ❤ Manipal Selfie Point', category: 'other', position: [26.8417676, 75.5647306] },
  { id: 13, name: 'Subway Entrance', category: 'other', position: [26.8419988, 75.5636986] },

  // Food
  { id: 20, name: 'BABA Food Court', category: 'food', position: [26.8430271, 75.5630765] },
  { id: 21, name: 'Zanak', category: 'food', position: [26.8461575, 75.5619849] },

  // Hostels (Good Host Spaces blocks)
  { id: 30, name: 'G2 Block (Girls Hostel)', category: 'hostel', position: [26.8406751, 75.5627091] },
  { id: 31, name: 'G3 Block (Girls Hostel)', category: 'hostel', position: [26.8405018, 75.5629086] },
  { id: 32, name: 'G4 Block (Girls Hostel)', category: 'hostel', position: [26.8405206, 75.5622397] },
  { id: 33, name: 'B5 Block (Boys Hostel)', category: 'hostel', position: [26.8418084, 75.5619673] },
  { id: 34, name: 'B6 Block (Boys Hostel)', category: 'hostel', position: [26.8422292, 75.5618891] },
];

// Subway/via helpers (26°50'29.7"N 75°33'48.3"E)
const SUBWAY_WAYPOINT: [number, number] = [26.841583, 75.563417];

function haversineMeters(a: [number, number], b: [number, number]) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

const isHostel = (coord: [number, number]) => {
  const HOSTEL_P = POIS.filter(p => p.category === 'hostel').map(p => p.position);
  return HOSTEL_P.some(p => haversineMeters(coord, p) < 200);
};

const isCampusCore = (coord: [number, number]) => {
  const CORE_P = POIS.filter(p => ['academic', 'admin', 'sports', 'food'].includes(p.category)).map(p => p.position);
  return CORE_P.some(p => haversineMeters(coord, p) < 250);
};

// Custom hook for routing
type RouteInfo = { distanceKm: number; durationMin: number; instructions?: string[] };

const useRoutingMachine = (
  map: L.Map | null,
  from: [number, number] | null,
  to: [number, number] | null,
  onUpdate?: (info: RouteInfo | null) => void,
  via?: [number, number] | null,
) => {
  const routingControl = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    // Remove existing routing control if any
    if (routingControl.current) {
      map.removeControl(routingControl.current);
    }
    // Prepare OSRM router
    const osrm = L.Routing.osrmv1({
      serviceUrl: OSRM_FOOT_URL,
      profile: 'foot',
      timeout: 30 * 1000,
    });

    // Helper to build and attach the routing control
    const buildControl = (useVia: boolean) => {
      const wpts = [
        L.latLng(from[0], from[1]),
        ...(useVia && via ? [L.latLng(via[0], via[1])] : []),
        L.latLng(to[0], to[1])
      ];
      routingControl.current = L.Routing.control({
        waypoints: wpts,
        plan: L.Routing.plan(wpts, { createMarker: () => null, draggableWaypoints: false, addWaypoints: false }),
        routeWhileDragging: false,
        fitSelectedRoutes: true,
        show: false,
        lineOptions: { styles: [{ color: '#2563eb', opacity: 0.9, weight: 6 }], extendToWaypoints: true, missingRouteTolerance: 1 } as L.Routing.LineOptions,
        router: osrm,
      }).addTo(map);

      const ctrlAny: any = routingControl.current as any;
      ctrlAny.on('routesfound', (e: any) => {
        const routes = (e.routes || []) as any[];
        routes.sort((a, b) => a.summary.totalDistance - b.summary.totalDistance);
        const best = routes[0];
        if (best && best.summary) {
          if (typeof ctrlAny._selectRoute === 'function') ctrlAny._selectRoute({ route: best });
          const distanceKm = Number((best.summary.totalDistance / 1000).toFixed(2));
          const durationMin = Math.round(best.summary.totalTime / 60);
          const instructions = (best.instructions || []).map((ins: any) => ins.text || ins.description || '');
          onUpdate?.({ distanceKm, durationMin, instructions });
        } else {
          onUpdate?.(null);
        }
      });
    };

    // Compare direct vs via-subway (if a via candidate is provided)
    if (via) {
      const directReq = [
        { latLng: L.latLng(from[0], from[1]) },
        { latLng: L.latLng(to[0], to[1]) }
      ];
      const viaReq = [
        { latLng: L.latLng(from[0], from[1]) },
        { latLng: L.latLng(via[0], via[1]) },
        { latLng: L.latLng(to[0], to[1]) }
      ];
      (osrm as any).route(directReq as any, ((errA: any, routesA: any[]) => {
        const bestA = (!errA && routesA && routesA.length) ? routesA.sort((a,b)=>a.summary.totalDistance-b.summary.totalDistance)[0] : null;
        (osrm as any).route(viaReq as any, ((errB: any, routesB: any[]) => {
          const bestB = (!errB && routesB && routesB.length) ? routesB.sort((a,b)=>a.summary.totalDistance-b.summary.totalDistance)[0] : null;
          const distA = bestA ? bestA.summary.totalDistance : Number.POSITIVE_INFINITY;
          const distB = bestB ? bestB.summary.totalDistance : Number.POSITIVE_INFINITY;
          buildControl(distB < distA);
        }) as any);
      }) as any);
    } else {
      buildControl(false);
    }

    return () => {
      if (routingControl.current) {
        map.removeControl(routingControl.current);
      }
    };
  }, [map, from, to, via]);

  return routingControl.current;
};

// Component for the map controls
const MapControls: React.FC<{ onRecenter: () => void; onClearRoute: () => void }> = ({ onRecenter, onClearRoute }) => (
  <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
    <button
      onClick={onRecenter}
      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      title="Recenter map"
    >
      🎯
    </button>
    <button
      onClick={onClearRoute}
      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      title="Clear route"
    >
      ❌
    </button>
  </div>
);

// Main map component
const CampusMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Record<string, boolean>>(
    Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [internalPath, setInternalPath] = useState<[number, number][] | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [voiceOn, setVoiceOn] = useState<boolean>(false);
  const mapRef = useRef<L.Map>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Listen for route info updates from RoutingControl
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<RouteInfo | null>).detail ?? null;
      setRouteInfo(detail);
    };
    window.addEventListener('route-info-update', handler as EventListener);
    return () => window.removeEventListener('route-info-update', handler as EventListener);
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation([latitude, longitude]);
          if (typeof accuracy === 'number') setAccuracy(accuracy);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  // Recenter map
  const handleRecenter = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation as [number, number], 18);
    } else {
      mapRef.current?.flyTo([26.8429, 75.5654], 16);
    }
  };

  // Clear route
  const handleClearRoute = () => {
    setSelectedPOI(null);
    setRouteInfo(null);
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setActiveCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter POIs based on active categories and search query
  const filteredPOIs = useMemo(() => {
    return POIS.filter(poi => {
      const matchesCategory = activeCategories[poi.category];
      const matchesSearch = poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          poi.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && (searchQuery === '' || matchesSearch);
    });
  }, [activeCategories, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle POI selection from search
  const handlePOISelect = (poi: POI) => {
    setSelectedPOI(poi);
    setIsDropdownOpen(false);
    if (mapRef.current) {
      mapRef.current.flyTo(poi.position, 18);
    }
  };

  // Choose via-point for hostel <-> campus-core routing through subway only when applicable
  const viaPoint = useMemo(() => {
    if (!userLocation || !selectedPOI) return null;
    const from = userLocation as [number, number];
    const to = selectedPOI.position as [number, number];
    const fromHostel = isHostel(from);
    const toHostel = isHostel(to);
    const fromCore = isCampusCore(from);
    const toCore = isCampusCore(to);
    if ((fromHostel && toCore) || (fromCore && toHostel)) return SUBWAY_WAYPOINT;
    return null;
  }, [userLocation, selectedPOI]);

  // Build internal campus route if both endpoints are within campus bounds OR in hostel/campus-core clusters
  useEffect(() => {
    if (!userLocation || !selectedPOI) {
      setInternalPath(null);
      return;
    }
    const from = userLocation as [number, number];
    const to = selectedPOI.position as [number, number];
    const fromCampusish = isWithinCampus(from) || isHostel(from) || isCampusCore(from);
    const toCampusish = isWithinCampus(to) || isHostel(to) || isCampusCore(to);
    const bothOnCampus = fromCampusish && toCampusish;
    if (!bothOnCampus) {
      setInternalPath(null);
      return;
    }
    const startId = nearestNodeId(from);
    const endId = nearestNodeId(to);
    if (!startId || !endId) {
      setInternalPath(null);
      return;
    }
    // Build both direct and via-subway paths and choose the shorter
    const directIds = dijkstra(CAMPUS_GRAPH, startId, endId);
    const viaA = dijkstra(CAMPUS_GRAPH, startId, SUBWAY_NODE_ID);
    const viaB = dijkstra(CAMPUS_GRAPH, SUBWAY_NODE_ID, endId);
    let chosenIds: string[] = [];
    const pathLength = (ids: string[]) => {
      if (!ids || ids.length < 2) return Number.POSITIVE_INFINITY;
      const latlngs: [number, number][] = ids.map(id => NODE_COORDS[id]);
      return latlngs.reduce((s, cur, i) => i === 0 ? 0 : s + haversineMeters(latlngs[i-1], cur), 0);
    };
    const directLen = pathLength(directIds);
    const viaIds = (viaA.length && viaB.length) ? [...viaA.slice(0, -1), ...viaB] : [];
    const viaLen = pathLength(viaIds);
    if (directLen <= viaLen) {
      chosenIds = directIds;
    } else {
      chosenIds = viaIds;
    }
    if (!chosenIds.length) {
      setInternalPath(null);
      return;
    }

    const latlngs: [number, number][] = chosenIds.map(id => NODE_COORDS[id]);
    setInternalPath(latlngs);

    // Update info and voice for internal route
    const totalMeters = latlngs.reduce((sum, cur, i) => {
      if (i === 0) return 0;
      return sum + haversineMeters(latlngs[i - 1], cur);
    }, 0);
    const distanceKm = Number((totalMeters / 1000).toFixed(2));
    const walkSpeed = 1.3; // m/s
    const durationMin = Math.round(totalMeters / walkSpeed / 60);
    setRouteInfo({ distanceKm, durationMin, instructions: ['Follow campus pedestrian paths to your destination.'] });
    speak(`Campus route ready. Distance ${distanceKm} kilometers. Estimated time ${durationMin} minutes.`);
  }, [userLocation, selectedPOI]);

  // Voice guidance helpers
  const speak = (text: string) => {
    if (!voiceOn) return;
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-11/12 max-w-md" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for locations..."
            className="w-full p-3 pr-10 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          
          {/* Search Results Dropdown */}
          {isDropdownOpen && (
            <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {filteredPOIs.length > 0 ? (
                filteredPOIs.map((poi) => (
                  <div
                    key={poi.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-0"
                    onClick={() => handlePOISelect(poi)}
                  >
                    <span className="text-lg">
                      {CATEGORIES[poi.category as keyof typeof CATEGORIES]?.icon || '📍'}
                    </span>
                    <div>
                      <div className="font-medium">{poi.name}</div>
                      <div className="text-xs text-gray-500">
                        {poi.category.charAt(0).toUpperCase() + poi.category.slice(1)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No locations found</div>
              )}
            </div>
          )}
        </div>
      </div>
      <MapContainer
        center={[26.8429, 75.5654]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User location marker + accuracy circle */}
        {userLocation && (
          <>
            {accuracy && (
              <Circle
                center={userLocation}
                radius={Math.min(accuracy, 60)}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, opacity: 0.3 }}
              />
            )}
            <CircleMarker
              center={userLocation}
              radius={6}
              pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 1 }}
              className="animate-pulse"
            >
              <Popup>Your current location</Popup>
            </CircleMarker>
          </>
        )}

        {/* POI Markers */}
        {filteredPOIs.map((poi) => (
          <Marker
            key={poi.id}
            position={poi.position}
            icon={L.divIcon({
              className: 'poi-marker',
              html: `${CATEGORIES[poi.category as keyof typeof CATEGORIES]?.icon || '📍'}`, 
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })}
            eventHandlers={{
              click: () => setSelectedPOI(poi),
            }}
          >
            <Popup>
              <div className="font-semibold">{poi.name}</div>
              <div className="text-sm text-gray-600">{poi.category}</div>
              {poi.description && <div className="mt-1 text-sm">{poi.description}</div>}
              <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                onClick={() => setSelectedPOI(poi)}
              >
                Navigate here
              </button>
            </Popup>
          </Marker>
        ))}

        {/* Destination marker */}
        {selectedPOI && (
          <Marker
            position={selectedPOI.position}
            icon={L.divIcon({
              className: 'poi-destination',
              html: '📍',
              iconSize: [36, 36],
              iconAnchor: [18, 36],
            })}
          />
        )}

        {/* Internal campus route or OSRM control */}
        {internalPath ? (
          <Polyline positions={internalPath} pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.8 }} />
        ) : (
          userLocation && selectedPOI && (
            <RoutingControl from={userLocation} to={selectedPOI.position} via={viaPoint} onVoice={speak} />
          )
        )}

      </MapContainer>

      {/* Filter panel */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-md">
        <h3 className="font-semibold mb-2">Filter Categories</h3>
        <div className="flex flex-col gap-1">
          {Object.entries(CATEGORIES).map(([key, { name, color }]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!activeCategories[key]}
                onChange={() => toggleCategory(key)}
                className="rounded"
                style={{ accentColor: color as string }}
              />
              <span>{name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance/Time Info Bar */}
      {routeInfo && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-[1000] bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm flex items-center gap-3">
          <span className="font-medium">Distance: {routeInfo.distanceKm} km</span>
          <span className="text-gray-500">•</span>
          <span className="font-medium">ETA: {routeInfo.durationMin} min</span>
          {selectedPOI && (
            <span className="text-gray-500">•</span>
          )}
          {selectedPOI && (
            <span className="text-gray-600">to {selectedPOI.name}</span>
          )}
        </div>
      )}

      {/* Turn-by-turn Instructions Sidebar */}
      {routeInfo?.instructions && routeInfo.instructions.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] w-80 max-w-[85vw] bg-white/95 backdrop-blur rounded-lg shadow-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold">Turn-by-turn</div>
            <button
              className="text-xs text-gray-500 hover:text-gray-800"
              onClick={() => setRouteInfo(prev => (prev ? { ...prev, instructions: [] } : prev))}
              title="Hide instructions"
            >
              Hide
            </button>
          </div>
          <ol className="max-h-80 overflow-auto px-4 py-3 list-decimal list-inside text-sm text-gray-800">
            {routeInfo.instructions.map((step, idx) => (
              <li key={idx} className="mb-2 leading-snug">{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Voice toggle */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          onClick={() => setVoiceOn(v => !v)}
          className={`bg-white px-3 py-2 rounded-full shadow-md hover:bg-gray-100 ${voiceOn ? 'text-blue-600' : 'text-gray-700'}`}
          title="Toggle voice guidance"
        >
          {voiceOn ? '🔊 Voice On' : '🔈 Voice Off'}
        </button>
      </div>
    </div>
  );
};

// Component to handle routing control
const RoutingControl: React.FC<{ from: [number, number]; to: [number, number]; via?: [number, number] | null; onVoice?: (text: string) => void }> = ({ from, to, via = null, onVoice }) => {
  const map = useMap();
  // In this inner component, we can't access setRouteInfo from the parent directly.
  // So we emit a window event that the parent listens to via the onUpdate callback.
  useRoutingMachine(map, from, to, (info) => {
    // Bubble the info up via a custom event for the parent component to catch if needed
    window.dispatchEvent(new CustomEvent('route-info-update', { detail: info }));
    if (onVoice && info) {
      onVoice(`Route ready. Distance ${info.distanceKm} kilometers. Estimated time ${info.durationMin} minutes.`);
    }
  }, via);
  return null;
};

export default CampusMap;
