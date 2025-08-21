# UniWay – MUJ Campus Navigation (Project README)

## Overview
UniWay is a Vite + React + TypeScript web app for navigating Manipal University Jaipur (MUJ). It provides a campus map, smart search via Google Places Autocomplete, helpful pages (contacts, lost & found, volunteers), Street View exploration, and an AI chatbot.

---

## Features (Implemented)
- Hero search with Google Places Autocomplete on the home page (`src/pages/Index.tsx`, `src/components/campus/SearchBar.tsx`).
- Interactive Google Map with campus POIs and details panel (`src/components/campus/GoogleMapsCampus.tsx`, `src/pages/Campus.tsx`).
- Street View explorer for preset locations (`src/components/campus/StreetViewLevels.tsx`).
- Category shortcuts on the home page for quick discovery.
- Lost & Found form and recent items (`src/pages/LostAndFound.tsx`).
- Volunteer Support info (`src/pages/VolunteerSupport.tsx`).
- Contacts and Emergency contacts pages (`src/pages/Contacts.tsx`, `src/pages/ContactsEmergency.tsx`).
- Crowd Heat Map demo (`src/pages/CrowdHeatMaps.tsx`).
- AI Chatbot using Gemini with server proxy fallback (`src/pages/Chatbot.tsx`, `server/index.js`).
- 404 page (`src/pages/NotFound.tsx`).

---

## Pages
Located in `src/pages/`:
- `Index.tsx` – Landing page (hero, search, explore button, categories)
- `Campus.tsx` – Main campus exploration page (Google Map)
- `Directions.tsx` – Directions helper
- `CrowdHeatMaps.tsx` – Crowd heat map demo
- `LostAndFound.tsx` – Lost and found
- `VolunteerSupport.tsx` – Student volunteer help
- `Contacts.tsx` – Key contacts
- `ContactsEmergency.tsx` – Emergency services
- `UniWayAPI.tsx` – UniWay API info (with contact link)
- `Chatbot.tsx` – AI chatbot (Gemini)
- `EmergencyServices.tsx` – Emergency services (alternate)
- `NotFound.tsx` – 404

---

## Tech Stack
- Framework: Vite + React + TypeScript
- UI/Styling: Tailwind CSS, shadcn/ui (Radix UI)
- Maps: Google Maps JavaScript API with Places + Street View
- Optional mapping libs present: Leaflet (+ React Leaflet) and Leaflet Routing Machine (used in demos)
- AI: Google Gemini via `@google/genai`
- Backend: Node.js + Express (simple proxy for Gemini)

---

## APIs Used
- Google Maps JavaScript API
  - Base map and Street View (`StreetViewService`, `StreetViewPanorama`)
- Google Places API (Web)
  - Autocomplete in `SearchBar.tsx` via `google.maps.places.Autocomplete`
- Google Gemini (Generative AI)
  - Client SDK: `@google/genai`
  - Backend proxy: `POST /api/chat` in `server/index.js`

Supporting utilities:
- `src/lib/google-maps-loader.ts` – single script loader for Maps JS with Places
- `src/lib/campus-data.ts` – campus locations
- `src/lib/campus-graph.ts` – graph helpers

---

## Environment Variables
Create `.env` in the project root (see `env.example`):
```
VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY
VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY   # optional client fallback
GEMINI_API_KEY=YOUR_GEMINI_KEY        # used by Express backend
```


## Installation & Scripts
Install dependencies:
```bash
npm install
```

Start Vite dev server (http://localhost:5173):
```bash
npm run dev
```

Start backend only (http://localhost:3001):
```bash
npm run server
```

Run both (backend + frontend) concurrently:
```bash
npm run dev:full
```

Build and preview:
```bash
npm run build
npm run preview   
```
 
## Implementation Roadmap (Full-Scale Development)

- **Foundations**
  - Finalize data model for campus POIs, categories, hours, accessibility, contacts.
  - Centralize config/env management; production API key restrictions and secrets storage.

- **Maps & Navigation**
  - Campus boundary, custom marker set, and clustering for dense POIs.
  - Directions: on-campus pedestrian routing + time/distance display.
  - Street View deep links from POIs; level presets for key buildings.

- **Data & Content**
  - Admin JSON/CSV import for POIs and events; validation pipeline.
  - Lost & Found persistence (lightweight DB) and moderation flow.
  - Contacts/Emergency directory with versioning and role-based updates.

- **AI & Backend**
  - Robust `/api/chat` with safety, rate limiting, logging; streaming responses.
  - Context grounding from campus data for location-aware answers.
  - Optional semantic search over FAQs and guides.

- **Mobile & UX**
  - PWA (installable, offline shell for static pages and cached tiles).
  - Accessibility pass (keyboard nav, ARIA, color contrast, reduced motion).
  - Onboarding for first-year students; saved favorites and recent searches.

- **Performance & Quality**
  - Code splitting and lazy-loading heavy map modules.
  - E2E smoke tests for main flows; visual snapshot tests for map UI.
  - Error boundary and telemetry (basic client metrics + backend health).

- **Deployment & Ops**
  - CI for lint/build/test; preview deployments per PR.
  - Staging + production environments; uptime/health alerts.
  - Rollback strategy and change log.


## License
For educational/demo use at MUJ. Follow Google Maps/Places and Gemini terms for production use.
