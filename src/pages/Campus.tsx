import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/campus/SearchBar';
import { CategoryGrid, categories, type Category } from '@/components/campus/CategoryGrid';
import GoogleMapsCampus, { type CampusLocation } from '@/components/campus/GoogleMapsCampus';
import { useNavigate, useLocation } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Footer from '@/components/Footer';

const Campus: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedGooglePlace, setSelectedGooglePlace] = useState<{ placeId: string; name: string; formatted_address?: string; location: { lat: number; lng: number } } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  // Routing removed; page is now search-focused
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const location = useLocation();

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Missing Google Maps API key. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
        return;
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleMapsLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize from navigation state (home search -> campus)
  useEffect(() => {
    const initial = (location.state as any)?.selectedLocation;
    if (initial) setSelectedLocation(initial);
  }, [location.state]);

  // Initialize selected Google Place from navigation state (home Explore with Google place)
  useEffect(() => {
    const gp = (location.state as any)?.selectedGooglePlace;
    if (gp) {
      setSelectedGooglePlace(gp);
      setSelectedLocation('');
    }
  }, [location.state]);

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
    setSelectedGooglePlace(null);
  };

  const handleGooglePlaceSelect = (place: { placeId: string; name: string; formatted_address?: string; location: { lat: number; lng: number } }) => {
    setSelectedGooglePlace(place);
    setSelectedLocation('');
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
                onGooglePlaceSelect={handleGooglePlaceSelect}
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
        {/* Search only: the main search is in the header. From/To routing removed. */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="h-[calc(100vh-200px)] min-h[600px]">
              {isGoogleMapsLoaded ? (
                <GoogleMapsCampus
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  selectedGooglePlace={selectedGooglePlace || undefined}
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
          </div>
        </div>

        {/* Mobile time calculator removed as routing handled by OSRM externally */}
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

      <Footer />
    </div>
  );
};

export default Campus;