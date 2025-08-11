import React from 'react';
import { 
  GraduationCap, 
  Utensils, 
  Home, 
  Dumbbell, 
  Building2, 
  Heart,
  MapPin,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  count: number;
  description: string;
}

interface CategoryGridProps {
  onCategorySelect?: (category: Category) => void;
  selectedCategories?: string[];
  variant?: 'grid' | 'chips';
}

const categories: Category[] = [
  {
    id: 'academic',
    name: 'Academic',
    icon: GraduationCap,
    color: 'text-category-academic',
    bgColor: 'bg-category-academic',
    count: 12,
    description: 'Lecture halls, labs, and study spaces'
  },
  {
    id: 'dining',
    name: 'Dining',
    icon: Utensils,
    color: 'text-category-dining',
    bgColor: 'bg-category-dining',
    count: 8,
    description: 'Cafes, canteens, and food courts'
  },
  {
    id: 'hostels',
    name: 'Hostels',
    icon: Home,
    color: 'text-category-hostels',
    bgColor: 'bg-category-hostels',
    count: 15,
    description: 'Student accommodation and residential areas'
  },
  {
    id: 'recreation',
    name: 'Recreation',
    icon: Dumbbell,
    color: 'text-category-recreation',
    bgColor: 'bg-category-recreation',
    count: 6,
    description: 'Sports, gym, and recreational facilities'
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: Building2,
    color: 'text-category-admin',
    bgColor: 'bg-category-admin',
    count: 9,
    description: 'Administrative offices and services'
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: Heart,
    color: 'text-category-medical',
    bgColor: 'bg-category-medical',
    count: 3,
    description: 'Health center and medical services'
  }
];

const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  onCategorySelect, 
  selectedCategories = [],
  variant = 'grid'
}) => {
  const handleCategoryClick = (category: Category) => {
    onCategorySelect?.(category);
  };

  if (variant === 'chips') {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`h-10 px-4 transition-all duration-200 ${
                isSelected 
                  ? `${category.bgColor} text-white hover:opacity-90` 
                  : 'hover-lift'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
              <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {category.count}
              </span>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategories.includes(category.id);
        
        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left hover-lift ${
              isSelected 
                ? `border-transparent ${category.bgColor} text-white shadow-medium` 
                : 'border-border bg-card hover:border-primary/20 shadow-soft'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 p-3 rounded-lg transition-colors duration-200 ${
                isSelected 
                  ? 'bg-white/20' 
                  : `${category.bgColor}/10 group-hover:${category.bgColor}/20`
              }`}>
                <Icon className={`h-6 w-6 ${
                  isSelected ? 'text-white' : category.color
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold text-lg ${
                    isSelected ? 'text-white' : 'text-foreground'
                  }`}>
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <MapPin className={`h-4 w-4 ${
                      isSelected ? 'text-white/80' : 'text-muted-foreground'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-muted-foreground'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm leading-relaxed ${
                  isSelected ? 'text-white/90' : 'text-muted-foreground'
                }`}>
                  {category.description}
                </p>
              </div>
            </div>
            
            {isSelected && (
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export { CategoryGrid, categories };
export type { Category };