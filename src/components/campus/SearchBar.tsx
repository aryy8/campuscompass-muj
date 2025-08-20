import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loadGoogleMapsWithPlaces } from '@/lib/google-maps-loader';

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'building' | 'department' | 'service';
  category: string;
  fullName?: string;
}

interface SearchBarProps {
  onLocationSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  variant?: 'default' | 'hero';
  onGooglePlaceSelect?: (place: { placeId: string; name: string; formatted_address?: string; location: { lat: number; lng: number } }) => void;
  hideManualSuggestions?: boolean;
}

// Lazy-load labels on first use
let cachedSuggestions: SearchSuggestion[] | null = null;

const loadSuggestions = async (): Promise<SearchSuggestion[]> => {
  if (cachedSuggestions) return cachedSuggestions;
  const mod = await import('@/lib/location-labels');
  const mapped: SearchSuggestion[] = mod.locationLabels.map(l => ({
    id: l.id,
    name: l.name,
    fullName: l.name,
    type: 'building',
    category: l.category,
  }));
  cachedSuggestions = mapped;
  return mapped;
};

const SearchBar: React.FC<SearchBarProps> = ({ 
  onLocationSelect, 
  placeholder = "Search buildings, departments, or services...",
  variant = 'default',
  onGooglePlaceSelect,
  hideManualSuggestions = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Removed recent searches: dropdown only opens on live matches
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // No preload; dropdown is driven only by active query matches
  }, [query]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadGoogleMapsWithPlaces();
        if (cancelled) return;
        if (!inputRef.current || autocompleteRef.current) return;
        const g = (window as any).google;
        if (!g?.maps?.places?.Autocomplete) return;
        // Define MUJ center and bounds (~5km box for campus and nearby)
        const mujCenter = { lat: 26.8431, lng: 75.5647 };
        const d = 0.045; // ~5km in degrees
        const bounds = new g.maps.LatLngBounds(
          new g.maps.LatLng(mujCenter.lat - d, mujCenter.lng - d),
          new g.maps.LatLng(mujCenter.lat + d, mujCenter.lng + d)
        );

        const ac = new g.maps.places.Autocomplete(inputRef.current as HTMLInputElement, {
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
          types: ['establishment'],
          // Note: bounds is a bias unless strictBounds is true
        });
        ac.setBounds(bounds);
        (ac as any).setOptions?.({ strictBounds: true });
        autocompleteRef.current = ac;
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          const loc = place?.geometry?.location;
          if (!place || !loc) return;
          // Prefer emitting Google place if callback provided
          if (onGooglePlaceSelect && place.place_id) {
            onGooglePlaceSelect({
              placeId: place.place_id,
              name: place.name || '',
              formatted_address: place.formatted_address,
              location: { lat: loc.lat(), lng: loc.lng() },
            });
            setShowSuggestions(false);
          }
        });
      } catch (e) {
        // fail silently, fallback to local suggestions
        // console.warn('Autocomplete init failed', e);
      }
    })();
    return () => { cancelled = true; };
  }, [onGooglePlaceSelect]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (hideManualSuggestions) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const all = await loadSuggestions();

    if (value.trim()) {
      const filtered = all.filter(suggestion =>
        suggestion.name.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onLocationSelect?.(suggestion);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Academic: 'text-category-academic',
      Dining: 'text-category-dining',
      Hostels: 'text-category-hostels',
      Recreation: 'text-category-recreation',
      Admin: 'text-category-admin',
      Medical: 'text-category-medical',
    };
    return colors[category as keyof typeof colors] || 'text-muted-foreground';
  };

  const containerClasses = variant === 'hero' 
    ? "relative w-full max-w-2xl mx-auto"
    : "relative w-full max-w-md";

  return (
    <div ref={searchRef} className={containerClasses}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          // No onFocus dropdown; only show on matching query
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="search"
          ref={inputRef}
          className={`pl-12 pr-4 py-3 w-full rounded-xl border-2 transition-all duration-200 focus:border-primary ${
            variant === 'hero' 
              ? 'h-14 text-lg shadow-medium text-black placeholder:text-gray-500 bg-white'
              : 'h-12'
          }`}
        />
      </div>

      {!hideManualSuggestions && showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-strong z-50 max-h-96 overflow-y-auto">
          {query && suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-muted transition-colors duration-150 flex items-center gap-3"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {suggestion.fullName || suggestion.name}
                      {suggestion.fullName && suggestion.name !== suggestion.fullName && (
                        <span className="text-muted-foreground ml-2">({suggestion.name})</span>
                      )}
                    </div>
                    <div className={`text-sm ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category} • {suggestion.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && suggestions.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for buildings, departments, or services</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;