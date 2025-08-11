import React, { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut, Layers, Navigation, MapPin, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { campusLocations, categoryColors } from '@/lib/campus-data';
import { buildGraphFromCoordinates, dijkstra } from '@/lib/shortest-path';

export interface MapLocation {
  id: string;
  name: string;
  category: string;
  coordinates: { x: number; y: number };
  description?: string;
  status?: 'open' | 'closed' | 'maintenance';
}

interface InteractiveMapProps {
  selectedLocation?: string;
  onLocationSelect?: (location: MapLocation) => void;
  filteredCategories?: string[];
  startLocationId?: string;
  endLocationId?: string;
}

const mockLocations: MapLocation[] = campusLocations;

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  selectedLocation, 
  onLocationSelect, 
  filteredCategories = [],
  startLocationId,
  endLocationId,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapView, setMapView] = useState<'campus' | 'satellite'>('campus');
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const graph = useMemo(() => {
    return buildGraphFromCoordinates(mockLocations);
  }, []);

  const shortestPath = useMemo(() => {
    if (!startLocationId || !endLocationId) return [] as string[];
    if (startLocationId === endLocationId) return [startLocationId];
    return dijkstra(graph, startLocationId, endLocationId);
  }, [graph, startLocationId, endLocationId]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => {
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStart) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  const visibleLocations = mockLocations.filter(location =>
    filteredCategories.length === 0 || filteredCategories.includes(location.category)
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'open': return 'bg-success';
      case 'closed': return 'bg-destructive';
      case 'maintenance': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-map rounded-xl overflow-hidden border-2 border-border shadow-map">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-1 shadow-medium">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetView}
            className="h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-1 shadow-medium">
          <Button
            variant={mapView === 'campus' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMapView('campus')}
            className="h-8 text-xs"
          >
            Campus
          </Button>
          <Button
            variant={mapView === 'satellite' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMapView('satellite')}
            className="h-8 text-xs"
          >
            Satellite
          </Button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-medium max-w-xs">
        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Legend
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div 
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `scale(${zoomLevel}) translate(${offset.x}px, ${offset.y}px)`,
          transition: dragStart ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {/* Campus Background */}
        <div className={`w-full h-full ${
          mapView === 'campus' 
            ? 'bg-gradient-to-br from-green-50 to-blue-50' 
            : 'bg-gradient-to-br from-green-100 to-gray-100'
        }`}>
          {/* Pathways */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 10 50 Q 30 30 50 40 T 90 35"
              stroke="hsl(var(--muted))"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 20 80 Q 40 60 60 65 T 80 60"
              stroke="hsl(var(--muted))"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 30 20 L 30 80"
              stroke="hsl(var(--muted))"
              strokeWidth="0.8"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 60 15 L 60 85"
              stroke="hsl(var(--muted))"
              strokeWidth="0.8"
              fill="none"
              opacity="0.6"
            />
            {/* Route Path (if any) */}
            {shortestPath.length > 1 && (
              <polyline
                points={shortestPath
                  .map((id) => {
                    const loc = mockLocations.find(l => l.id === id)!;
                    return `${loc.coordinates.x},${loc.coordinates.y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              >
                <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1.2s" repeatCount="indefinite" />
              </polyline>
            )}
          </svg>

          {/* Location Markers */}
          {visibleLocations.map((location) => {
            const isSelected = selectedLocation === location.id;
            const color = categoryColors[location.category as keyof typeof categoryColors];
            const isStart = startLocationId === location.id;
            const isEnd = endLocationId === location.id;
            
            return (
              <button
                key={location.id}
                onClick={() => onLocationSelect?.(location)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10 ${
                  isSelected ? 'scale-125' : ''
                }`}
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`,
                }}
              >
                <div className="relative">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-medium flex items-center justify-center ${
                      isStart ? 'ring-2 ring-green-500' : isEnd ? 'ring-2 ring-red-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${getStatusColor(location.status)}`} />
                  
                  {/* Location label */}
                  <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur-sm px-2 py-1 rounded shadow-medium text-xs font-medium whitespace-nowrap transition-opacity duration-200 ${
                    isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                  }`}>
                    {location.name}
                  </div>

                  {/* Selection ring */}
                  {isSelected && (
                    <div 
                      className="absolute inset-0 rounded-full border-2 animate-pulse"
                      style={{ borderColor: color }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute top-4 left-4 z-20 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-medium max-w-sm">
          {(() => {
            const location = mockLocations.find(l => l.id === selectedLocation);
            if (!location) return null;
            
            return (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{location.name}</h3>
                  <Badge 
                    variant={location.status === 'open' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {location.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {location.category} Facility
                </p>
                {location.description && (
                  <p className="text-sm text-muted-foreground mt-2">{location.description}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="default" className="text-xs">
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    More Info
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
export type { MapLocation };