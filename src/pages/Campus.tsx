import React, { useState } from 'react';
import { ArrowLeft, Filter, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/campus/SearchBar';
import { CategoryGrid, categories, type Category } from '@/components/campus/CategoryGrid';
import InteractiveMap, { type MapLocation } from '@/components/campus/InteractiveMap';
import { useNavigate } from 'react-router-dom';

const Campus: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleLocationSelect = (location: MapLocation) => {
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

      {/* Map Container */}
      <main className="container mx-auto px-4 py-4 flex-1">
        <div className="h-[calc(100vh-200px)] min-h-[600px]">
          <InteractiveMap
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            filteredCategories={selectedCategories}
          />
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