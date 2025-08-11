import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Map, 
  Search, 
  GraduationCap, 
  Utensils, 
  Home, 
  Dumbbell, 
  Building2, 
  Heart,
  ArrowRight,
  MapPin,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/campus/SearchBar';
import { CategoryGrid } from '@/components/campus/CategoryGrid';
import campusHero from '@/assets/campus-hero.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [buildingCount, setBuildingCount] = useState(0);
  const [hostelCount, setHostelCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const animateCounter = (setter: (value: number) => void, target: number, duration: number = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    setTimeout(() => {
      animateCounter(setBuildingCount, 50, 2000);
      animateCounter(setHostelCount, 15, 1500);
    }, 1000);
  }, []);

  const handleExploreClick = () => {
    navigate('/campus');
  };

  const handleSearchSelect = (suggestion: any) => {
    // Navigate to campus with selected location
    navigate('/campus', { state: { selectedLocation: suggestion.id } });
  };

  const handleCategorySelect = (category: any) => {
    // Navigate to campus with category filter
    navigate('/campus', { state: { selectedCategory: category.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusHero})` }}
        >
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px]" />
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 text-center text-white max-w-4xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight animate-fade-in">
              Uni<span className="text-accent animate-pulse">Way</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Campus Navigation Made Simple
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Navigate Manipal University Jaipur with ease. Find buildings, get directions, 
              and discover campus facilities in seconds.
            </p>
          </div>

          {/* Hero Search */}
          <div className={`mb-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SearchBar 
              onLocationSelect={handleSearchSelect}
              placeholder="Search for buildings, departments, or services..."
              variant="hero"
            />
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button 
              variant="hero" 
              size="lg"
              onClick={handleExploreClick}
              className="text-lg px-8 py-6 h-auto hover-scale"
            >
              <Map className="mr-3 h-6 w-6" />
              Explore Campus
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm hover-scale"
            >
              <Navigation className="mr-3 h-6 w-6" />
              Get Directions
            </Button>
          </div>

          {/* Quick Stats */}
          <div className={`mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto transition-all duration-1000 delay-1300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center hover-scale">
              <div className="text-2xl font-bold text-accent">{buildingCount}+</div>
              <div className="text-sm text-white/80">Buildings</div>
            </div>
            <div className="text-center hover-scale">
              <div className="text-2xl font-bold text-accent">{hostelCount}</div>
              <div className="text-sm text-white/80">Hostels</div>
            </div>
            <div className="text-center hover-scale">
              <div className="text-2xl font-bold text-accent">24/7</div>
              <div className="text-sm text-white/80">Navigation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quickly find what you're looking for with our organized category system. 
              From academic blocks to dining options, everything is just a click away.
            </p>
          </div>

          <CategoryGrid onCategorySelect={handleCategorySelect} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose UniWay?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for MUJ students, with features that make campus navigation effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-card border border-border shadow-soft hover-lift">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-muted-foreground">
                Find any location instantly with intelligent autocomplete and nickname recognition.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-card border border-border shadow-soft hover-lift">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Turn-by-Turn Directions</h3>
              <p className="text-muted-foreground">
                Get precise walking directions with estimated time and distance to any campus location.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-card border border-border shadow-soft hover-lift">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Info</h3>
              <p className="text-muted-foreground">
                Check facility hours, maintenance status, and crowd levels before you go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Navigate MUJ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who use UniWay to navigate campus efficiently every day.
          </p>
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleExploreClick}
            className="text-lg px-8 py-6 h-auto bg-white text-primary hover:bg-white/90"
          >
            <Map className="mr-3 h-6 w-6" />
            Start Exploring Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Map className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Uni<span className="text-accent">Way</span></span>
          </div>
          <p className="text-muted-foreground mb-4">
            Campus navigation for Manipal University Jaipur
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 UniWay. Designed for MUJ students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
