import React, { useState, useEffect, useRef } from 'react';
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
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ThemeToggle from '@/components/ui/theme-toggle';
import LoginDialog from '@/components/ui/login-dialog';
import Footer from '@/components/Footer';
import { locationLabels } from '@/lib/location-labels';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [buildingCount, setBuildingCount] = useState(0);
  const [hostelCount, setHostelCount] = useState(0);
  const campusViewRef = useRef<HTMLDivElement>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const categoryIdToTitle: Record<string, string> = {
    academic: 'Academic',
    dining: 'Dining',
    hostels: 'Hostels',
    recreation: 'Recreation',
    admin: 'Admin',
    medical: 'Medical',
  };

  const categoryItems = selectedCategoryId
    ? locationLabels.filter(l => l.category === categoryIdToTitle[selectedCategoryId])
    : [];

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
    navigate('/campus', { state: { selectedLocation: suggestion.id } });
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategoryId(category.id);
  };

  const handleScrollTo360 = () => {
    campusViewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Controls overlay */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          <ThemeToggle />
          <LoginDialog />
        </div>
        {/* Background Image with Enhanced Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/muj.jpg')` }}
        >
          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          
          {/* Subtle animated particles effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute top-40 right-32 w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-40 right-20 w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left floating element */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-xl animate-float" />
          
          {/* Top-right floating element */}
          <div className="absolute top-32 right-16 w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-xl animate-float-delayed" />
          
          {/* Bottom floating elements */}
          <div className="absolute bottom-32 left-20 w-20 h-20 bg-gradient-to-tr from-accent/15 to-transparent rounded-full blur-lg animate-float-slow" />
          <div className="absolute bottom-20 right-32 w-28 h-28 bg-gradient-to-tl from-primary/15 to-transparent rounded-full blur-lg animate-float-delayed-slow" />
        </div>

        {/* Hero Content with Enhanced Styling */}
        <div className={`relative z-10 text-center text-white max-w-5xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8 relative flex flex-col items-center justify-center">
            {/* Paper rocket animation over the logo */}
            <svg
              width="240"
              height="70"
              viewBox="0 0 240 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              className="mt-6 mb-1 md:mt-8 md:mb-2 w-[200px] md:w-[240px] h-[54px] md:h-[70px]"
              style={{ display: 'block' }}
            >
              {/* Invisible motion path (no dashed arc) */}
              <path id="rocket-curve" d="M 10 60 Q 120 -5 230 60" stroke="none" fill="none" />
              <g>
                <animateMotion dur="3s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" rotate="auto">
                  <mpath xlinkHref="#rocket-curve" />
                </animateMotion>
                {/* Paper rocket */}
                <svg width="26" height="26" viewBox="0 0 24 24" style={{ transform: 'rotate(90deg)' }}>
                  <g>
                    <polygon points="12,2 15,16 12,13 9,16" fill="#ffffff" stroke="#facc15" strokeWidth="1.2" />
                    <polygon points="12,13 15,16 12,22 9,16" fill="#facc15" stroke="#facc15" strokeWidth="0.5" />
                    <circle cx="12" cy="6" r="1.1" fill="#facc15" />
                  </g>
                </svg>
              </g>
            </svg>
            
            {/* Enhanced Logo with Better Typography */}
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight animate-fade-in relative z-10 drop-shadow-2xl">
                <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
                  U<span className="relative">ni</span>
                </span>
                <span className="bg-gradient-to-r from-accent via-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse relative z-10">
                  Way
                </span>
              </h1>
            </div>
          </div>
          
          {/* Enhanced Main Tagline */}
          <p className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in tracking-tight drop-shadow-2xl" style={{ animationDelay: '0.3s' }}>
            Find your way through{' '}
            <span className="bg-gradient-to-r from-accent via-yellow-400 to-orange-400 bg-clip-text text-transparent font-black">
              UniWay
            </span>
          </p>
          
          {/* Enhanced Sub-Tagline */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in font-light tracking-wide leading-relaxed" style={{ animationDelay: '0.6s' }}>
            
          </p>

          {/* Enhanced Hero Search with Glassmorphism */}
          <div className={`mb-10 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
               style={{ zIndex: 30, position: 'relative' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl" />
              <div className="relative z-30">
                <SearchBar 
                  onLocationSelect={handleSearchSelect}
                  placeholder="Search for buildings, departments, or services..."
                  variant="hero"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons with Better Styling */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
               style={{ marginTop: '2.5rem' }}>
            <Button 
              variant="hero" 
              size="lg"
              onClick={handleExploreClick}
              className="text-lg px-10 py-7 h-auto hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-accent to-orange-500 border-0 shadow-xl"
            >
              <Navigation className="mr-3 h-6 w-6" />
              Get Directions
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleScrollTo360}
              className="text-lg px-10 py-7 h-auto bg-white/15 border-2 border-white/30 text-white hover:bg-white/25 hover:border-white/50 backdrop-blur-md hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <Map className="mr-3 h-6 w-6" />
              Explore Campus
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* 360 Degree View Section */}
      <section ref={campusViewRef} className="py-12 px-4 bg-background flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">360° Campus View</h2>
        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!4v1754939868721!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNVhCYnc.!2m2!1d26.84407091446291!2d75.56522833275928!3f30.981440496839397!4f4.626082950846595!5f0.7820865974627469"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="360 Degree Campus View"
          ></iframe>
        </div>
      </section>

      {/* Enhanced Feature Highlights Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">UniWay</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of campus navigation with cutting-edge features designed for modern students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1: Smart Navigation */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  Smart Navigation
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Get real-time directions with intelligent pathfinding that considers campus layout, shortcuts, and accessibility features.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Feature Card 2: Interactive Maps */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  Interactive Maps
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Explore campus with high-resolution maps, 3D building views, and real-time updates on construction and events.
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors duration-300">
                  <span>Explore now</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Feature Card 3: Real-time Updates */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  Real-time Updates
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Stay informed with live notifications about class changes, building closures, and campus events as they happen.
                </p>
                <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors duration-300">
                  <span>Stay updated</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Feature Card 4: Accessibility First */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  Accessibility First
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Designed for everyone with voice navigation, high contrast modes, and wheelchair-accessible route planning.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors duration-300">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Feature Card 5: Offline Support */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  Offline Support
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Download campus maps and navigate even without internet connection. Perfect for areas with poor signal.
                </p>
                <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors duration-300">
                  <span>Download maps</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Feature Card 6: Smart Search */}
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  Smart Search
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Find anything on campus instantly with AI-powered search that understands natural language queries.
                </p>
                <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors duration-300">
                  <span>Try search</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
              Explore All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-black">Explore Campus</h2>
        <div className="max-w-6xl mx-auto">
          <CategoryGrid onCategorySelect={handleCategorySelect} />

          {selectedCategoryId && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">
                  {categoryIdToTitle[selectedCategoryId]} locations ({categoryItems.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategoryId(null)}>Clear</Button>
              </div>

              {categoryItems.length === 0 ? (
                <p className="text-muted-foreground">No locations available for this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoryItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => navigate('/campus', { state: { selectedLocation: item.id } })}
                      className="text-left p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;