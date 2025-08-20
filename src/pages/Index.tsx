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
  Navigation,
  Flame,
  Package,
  HandHeart,
  AlertTriangle,
  Bot,
  Phone,
  Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/campus/SearchBar';
import { CategoryGrid } from '@/components/campus/CategoryGrid';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import StreetViewLevels from '@/components/campus/StreetViewLevels';
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
  const [show360, setShow360] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedGooglePlace, setSelectedGooglePlace] = useState<{
    placeId: string;
    name: string;
    formatted_address?: string;
    location: { lat: number; lng: number };
  } | null>(null);

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

  // Lazy-mount the 360 Street View section when scrolled near viewport
  useEffect(() => {
    if (!campusViewRef.current) return;
    const el = campusViewRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShow360(true);
            io.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: '200px', threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleExploreClick = () => {
    if (selectedGooglePlace) {
      navigate('/campus', { state: { selectedGooglePlace } });
    } else {
      navigate('/campus');
    }
  };

  const handleLeafletDirectionsClick = () => {
    window.open(
      'https://map.project-osrm.org/?z=18&center=26.840851%2C75.562302&loc=&loc=&hl=en&alt=0&srv=2',
      '_blank',
      'noopener,noreferrer'
    );
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
            
            {/* Enhanced Logo with Better Typography (Safari-safe) */}
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight animate-fade-in relative z-10 drop-shadow-2xl">
                {/* Render "Uni" as a single span to avoid inner span clipping issues on Safari */}
                <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent [webkit-text-fill-color:transparent]">
                  Uni
                </span>
                <span className="bg-gradient-to-r from-accent via-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse relative z-10 [webkit-text-fill-color:transparent]">
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
                  onLocationSelect={undefined}
                  onGooglePlaceSelect={(p) => setSelectedGooglePlace(p)}
                  placeholder="Search places around MUJ..."
                  variant="hero"
                  hideManualSuggestions
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
              Explore
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleLeafletDirectionsClick}
              className="text-lg px-10 py-7 h-auto hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl"
            >
              <MapPin className="mr-3 h-6 w-6" />
              Get Directions
            </Button>
          </div>
        </div>
      </section>

      {/* 360 Degree View Section */}
      <section ref={campusViewRef} className="py-12 px-4 bg-background flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-center">360° Campus View</h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Street View with level switching is live on the home page 360 section; ready for your level coordinates to refine.
        </p>
        <div className="w-full max-w-4xl">
          {show360 && (
            <StreetViewLevels
              height={420}
              levels={[
              // Tip: Click each level; the resolved pano ID is shown below the viewer. Share those to lock in exact panoIds.
              { id: 'L1', label: 'Dome', position: { lat: 26.844071, lng: 75.565228 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755535881817!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNVhCYnc.!2m2!1d26.84407091446291!2d75.56522833275928!3f30.98!4f4.6299999999999955!5f0.5970117501821992' },
              { id: 'Library', label: 'Library', position: { lat: 26.8440607, lng: 75.5652878 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755534163449!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNVhaTWc.!2m2!1d26.84406065003139!2d75.56528784853882!3f202.2794505640211!4f-3.185439736735333!5f0.7820865974627469' },
              { id: 'AB1', label: 'AB1', position: { lat: 26.84409899371046, lng: 75.56513888138585 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755536705351!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNDJYT3c.!2m2!1d26.84409899371046!2d75.56513888138585!3f179.8570992173503!4f4.159413701647793!5f0.4000000000000002' },
              { id: 'AB2', label: 'AB2', position: { lat: 26.84409899371046, lng: 75.56513888138585 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755536705351!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNDJYT3c.!2m2!1d26.84409899371046!2d75.56513888138585!3f179.8570992173503!4f4.159413701647793!5f0.4000000000000002' },
              { id: 'AIC', label: 'AIC', position: { lat: 26.84385521744164, lng: 75.56523428433832 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755537330235!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzhxLVdrMlFF!2m2!1d26.84385521744164!2d75.56523428433832!3f39.56364515148488!4f-10.239939263007102!5f0.7820865974627469' },
              { id: 'ConferenceRoom', label: 'Conference room', position: { lat: 26.84385433771263, lng: 75.5652359720995 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755537377068!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzhxXzN3Z1FF!2m2!1d26.84385433771263!2d75.5652359720995!3f352.4658820364628!4f0.1660954161468169!5f0.7820865974627469' },
              { id: 'Finance', label: 'Finance', position: { lat: 26.84388215573711, lng: 75.56523384019064 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755537436240!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxOTM1YVE.!2m2!1d26.84388215573711!2d75.56523384019064!3f352.99579179300775!4f-16.208577209374965!5f0.7820865974627469' },
              { id: 'Gym', label: 'Gym', position: { lat: 26.84388183829127, lng: 75.56522993169098 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755537469687!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxOTM1Ymc.!2m2!1d26.84388183829127!2d75.56522993169098!3f25.33257048692999!4f-18.64588226498482!5f0.7820865974627469' },
              { id: 'OldMess', label: 'Old mess', position: { lat: 26.844071, lng: 75.565228 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755535881817!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxNVhCYnc.!2m2!1d26.84407091446291!2d75.56522833275928!3f30.98!4f4.6299999999999955!5f0.5970117501821992' },
              { id: 'GameRoom', label: 'Game room', position: { lat: 26.84385521744164, lng: 75.56523428433832 }, embedSrc: 'https://www.google.com/maps/embed?pb=!4v1755536246831!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzhxOTM1S1E.!2m2!1d26.84385521744164!2d75.56523428433832!3f0.05917622296095715!4f-6.501571231872646!5f0.7820865974627469' },
            ]}
              initialLevelId="L1"
            />
          )}
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
            {/* Crowd Heat Maps */}
            <div className="text-left group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">Crowd Heat Maps</h3>
                <p className="text-gray-600 leading-relaxed">Visualize busy areas on campus with a heatmap overlay.</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => navigate('/crowd')} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">View Heatmap</button>
                  <button onClick={() => navigate('/campus')} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">Explore Map</button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Lost & Found */}
            <div className="text-left group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">Lost & Found</h3>
                <p className="text-gray-600 leading-relaxed">Report or browse found items around MUJ.</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => navigate('/lost-found')} className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm hover:bg-amber-700 transition-colors">Browse Items</button>
                  <button onClick={() => navigate('/lost-found')} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">Report Item</button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Volunteer Support */}
            <div className="text-left group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <HandHeart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">Volunteer Support</h3>
                <p className="text-gray-600 leading-relaxed">Connect with student volunteers for on-campus help.</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => navigate('/volunteer')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors">Request Help</button>
                  <button onClick={() => navigate('/volunteer')} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">View Volunteers</button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Contacts & Emergency (combined) */}
            <div className="text-left group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-cyan-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="relative w-8 h-8">
                    <AlertTriangle className="absolute -left-1 -top-0.5 w-5 h-5 text-white/90" />
                    <Phone className="absolute left-2 top-2 w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-300">Contacts & Emergency</h3>
                <p className="text-gray-600 leading-relaxed">Important office contacts and urgent numbers in one place.</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => navigate('/contacts-emergency')} className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-700 transition-colors">Open</button>
                  <button onClick={() => navigate('/emergency')} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">Emergency Only</button>
                  <button onClick={() => navigate('/contacts')} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">Contacts Only</button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-cyan-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* AI Chatbot */}
            <div className="text-left group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">AI Chatbot</h3>
                <p className="text-gray-600 leading-relaxed">Ask about MUJ — academics, places, events and more.</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => navigate('/chatbot')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors">Open Chatbot</button>
                  <button onClick={() => navigate('/chatbot')} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 transition-colors">Shortcuts</button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* UniWay API */}
            <div className="text-left group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">UniWay API</h3>
                <p className="text-gray-600 leading-relaxed">Enable other colleges to create their own campus navigation system with UniWay’s flexible API.</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => navigate('/uniway-api')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors">Learn More</button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
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