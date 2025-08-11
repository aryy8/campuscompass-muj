import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Map as MapIcon, Flag, Navigation as NavIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/campus/SearchBar';
import { CategoryGrid, categories, type Category } from '@/components/campus/CategoryGrid';
import GoogleMapsCampus, { type CampusLocation } from '@/components/campus/GoogleMapsCampus';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Campus: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [startId, setStartId] = useState<string>('');
  const [endId, setEndId] = useState<string>('');
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDboUSRvu5PJ81W1J-e2Zl4Z7gwxV-L0ZM&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleMapsLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(category.id);
      if (isSelected) {
        return prev.filter(id => id !== category.id);
      } else {
        return [...prev, category.id];
      }
    });
  };

  const handleLocationSelect = (location: CampusLocation) => {
    setSelectedLocation(location.id);
  };

  const handleSearchSelect = (suggestion: any) => {
    // In a real app, this would find the corresponding location on the map
    setSelectedLocation(suggestion.id);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                onLocationSelect={handleSearchSelect}
                placeholder="Search campus locations..."
              />
            </div>
            
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {selectedCategories.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-primary-light text-white text-xs rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Map Section */}
      <section className="container mx-auto px-4 pt-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Explore Campus</h1>
        {/* From/To Controls */}
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <select
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">From: Select a start</option>
              <option value="1">Academic Block 1</option>
              <option value="2">Central Library</option>
              <option value="3">Food Court</option>
              <option value="4">Hostel A</option>
              <option value="5">Hostel B</option>
              <option value="6">Sports Complex</option>
              <option value="7">Medical Center</option>
              <option value="8">Admin Office</option>
              <option value="9">Canteen</option>
              <option value="10">Gym</option>
              <option value="11">Dome Building</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <NavIcon className="h-4 w-4 text-muted-foreground" />
            <select
              value={endId}
              onChange={(e) => setEndId(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">To: Select a destination</option>
              <option value="1">Academic Block 1</option>
              <option value="2">Central Library</option>
              <option value="3">Food Court</option>
              <option value="4">Hostel A</option>
              <option value="5">Hostel B</option>
              <option value="6">Sports Complex</option>
              <option value="7">Medical Center</option>
              <option value="8">Admin Office</option>
              <option value="9">Canteen</option>
              <option value="10">Gym</option>
              <option value="11">Dome Building</option>
            </select>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-card border-b border-border shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Filter by Category</h3>
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
            <CategoryGrid
              variant="chips"
              selectedCategories={selectedCategories}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </div>
      )}

      {/* Interactive Campus Map Container */}
      <main className="container mx-auto px-4 py-4 flex-1">
        <div className="h-[calc(100vh-200px)] min-h-[600px]">
          {isGoogleMapsLoaded ? (
            <GoogleMapsCampus
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              startLocationId={startId}
              endLocationId={endId}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading Google Maps...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Location Info */}
      {selectedLocation && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-20">
          <div className="bg-card border border-border rounded-lg p-4 shadow-strong">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Location Details</h3>
                <p className="text-sm text-muted-foreground">
                  Tap the map marker for more information
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLocation('')}
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campus;