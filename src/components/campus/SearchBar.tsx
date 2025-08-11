import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', name: 'AB1', type: 'building', category: 'Academic', fullName: 'Academic Block 1' },
  { id: '2', name: 'Central Library', type: 'building', category: 'Academic' },
  { id: '3', name: 'Hostel A', type: 'building', category: 'Hostels' },
  { id: '4', name: 'Food Court', type: 'building', category: 'Dining' },
  { id: '5', name: 'Medical Center', type: 'building', category: 'Medical' },
  { id: '6', name: 'Sports Complex', type: 'building', category: 'Recreation' },
  { id: '7', name: 'Admin Office', type: 'building', category: 'Admin' },
  { id: '8', name: 'Computer Science', type: 'department', category: 'Academic' },
  { id: '9', name: 'Registrar', type: 'service', category: 'Admin' },
  { id: '10', name: 'Canteen', type: 'building', category: 'Dining' },
];

const SearchBar: React.FC<SearchBarProps> = ({ 
  onLocationSelect, 
  placeholder = "Search buildings, departments, or services...",
  variant = 'default'
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState<SearchSuggestion[]>([
    mockSuggestions[0], mockSuggestions[1], mockSuggestions[4]
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions(recentSearches);
      setShowSuggestions(true);
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
          onFocus={() => {
            setSuggestions(query ? suggestions : recentSearches);
            setShowSuggestions(true);
          }}
          className={`pl-12 pr-4 py-3 w-full rounded-xl border-2 transition-all duration-200 focus:border-primary ${
            variant === 'hero' ? 'h-14 text-lg shadow-medium' : 'h-12'
          }`}
        />
      </div>

      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-strong z-50 max-h-96 overflow-y-auto">
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span>Recent Searches</span>
              </div>
              {recentSearches.map((suggestion) => (
                <button
                  key={`recent-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-150 flex items-center gap-3"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {suggestion.fullName || suggestion.name}
                    </div>
                    <div className={`text-sm ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

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