#  UniWay – MUJ Campus Navigation Web App

##  Overview
**UniWay** is a responsive, student-centric campus navigation platform for **Manipal University Jaipur (MUJ)**.  
It helps students, parents, and visitors easily find locations, plan routes, explore events, and access essential campus services — all in one place.

---

## Features

### 🏠 Landing Page
- Clean, minimal design with UniWay logo.
- Prominent search bar front and center.
- "Explore Campus" button to open the interactive map.
- Quick category shortcuts: Academic, Dining, Hostels, Recreation, Admin, Medical.

### 🗺 Interactive Campus Map
- Zoomable, pannable MUJ campus map with building outlines.
- Clickable markers showing facility details.
- Custom icons for different facility types.
- Satellite & blueprint-style map toggle.

### 🔍 Smart Search Bar
- Autocomplete for buildings, departments, events, and services.
- Supports abbreviations/nicknames (e.g., “AB1” → “Academic Block 1”).
- Click to highlight location on map.

### 🚶 Route Planning
- Turn-by-turn walking directions with step markers.
- Distance & estimated time display.
- Multi-stop route planning.
- Start from GPS location or any selected point.

### 🗂 Location Categories
- Filters: Academic, Hostels, Dining, Recreation, Admin, Medical, Events.
- Multi-category selection.

### 📢 Real-time Facility Info
- Open/close status & operational hours.
- Maintenance alerts.
- Optional live crowd density indicators.

### 🎉 Event & Announcement Layer
- Upcoming events pinned on the map.
- Clickable details with description, time, and location.
- **Fest Mode** for highlighting stalls and venues during events.

### 🎓 Student Services
- Lost & Found form with map pin + photo.
- Emergency contacts with quick dial.
- Routes to Medical Center or Security Office.

### 💡 UX Add-ons
- **First Year Friendly** onboarding for freshers.
- Favorites list for quick location access.
- Accessible route highlighting.
- Dark mode toggle.
- QR Code scanning for building-specific floor plans.

---

## 🚀 Future Scope

### 🚌 Campus Transport & Commute
- **Carpooling & Ride Sharing** – Connect students for eco-friendly travel.
- Shuttle tracking and schedule integration.

### 🧭 Student Guidance & Social
- **Student Guides** – Volunteer helpers for freshers.
- Clubs & forums for student interaction.
- Sports team finder (e.g., for GHS teams).

### 🍽 Food & Lifestyle
- Mess comparison dashboard.
- Food reviews & ratings.
- Highlighted delivery pickup points.

### 🏫 Academic & Campus Utility
- Class timetable upload for route planning.
- Salon, park, courts, and other amenity labels.
- Outhouse events guide.

### 🔍 Lost & Found 2.0
- AI-powered image match for lost items.
- Location-based lost item alerts.

---

## 🛠 Tech Stack
- **Frontend:** React / Next.js
- **Styling:** Tailwind CSS
- **Maps:** Leaflet.js, Mapbox, or Google Maps API
- **Routing API:** OSRM, Mapbox Directions, or Google Directions API
- **Responsive Design:** Desktop & mobile optimized
- **Animations:** Smooth transitions for filters, search results, and route drawing

---
## 🏗️ Project Structure

```
src/
├── components/
│   └── campus/
│       ├── GoogleMapsCampus.tsx    # Main Google Maps component
│       ├── SearchBar.tsx           # Location search functionality
│       └── CategoryGrid.tsx        # Category filtering
├── pages/
│   ├── Campus.tsx                  # Main campus exploration page
│   └── Index.tsx                   # Landing page
├── lib/
│   ├── campus-data.ts              # Campus location data
│   └── shortest-path.ts            # (Legacy) Pathfinding
├── types/
│   └── google-maps.d.ts            # Google Maps TypeScript definitions
└── assets/                         # Images and static assets
```

---

## 🛠️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/campuscompass-muj.git
cd campuscompass-muj
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Google Maps API Key
- Obtain a Google Maps JavaScript API key ([instructions](GOOGLE_MAPS_SETUP.md)).
- Create a `.env` file in the project root and add:
  ```bash
  VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY
  ```
  Vite automatically exposes variables prefixed with `VITE_` to the client. The app reads this value via `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`.

### 4. Start the Development Server
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 Goal
To make campus navigation seamless, engaging, and student-focused —  
improving accessibility, safety, and convenience at MUJ.

---


**Find your way — the UniWay way.**
