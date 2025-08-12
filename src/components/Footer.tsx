import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="mt-16 border-t border-border bg-card/60 backdrop-blur">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">UniWay</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Smart, simple campus navigation for MUJ. Find buildings, routes, and facilities with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground text-left">Home</button>
              <button onClick={() => navigate('/campus')} className="text-muted-foreground hover:text-foreground text-left">Campus Map</button>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Get Started</h4>
            <div className="flex gap-2">
              <Button variant="default" onClick={() => navigate('/campus')}>Open Map</Button>
              <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} UniWay • MUJ Campus Navigation</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500" /> by <span className="font-medium">Team French Fries</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 