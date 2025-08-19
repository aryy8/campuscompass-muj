import React from 'react';
import { Helmet } from 'react-helmet-async';

// Import the map component
import CampusMap from '../components/map/CampusMap';

const DirectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>MUJ Campus Navigation | Directions</title>
        <meta name="description" content="Interactive campus navigation for Manipal University Jaipur" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Helmet>

      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">MUJ Campus Navigation</h1>
          <p className="text-sm opacity-80">Find your way around Manipal University Jaipur</p>
        </div>
      </header>

      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <CampusMap />
        </div>
      </main>

      <footer className="bg-gray-100 p-3 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} MUJ Campus Compass</p>
      </footer>
    </div>
  );
};

export default DirectionsPage;
