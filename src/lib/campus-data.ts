export interface CampusLocation {
  id: string;
  name: string;
  category: 'academic' | 'dining' | 'hostels' | 'recreation' | 'admin' | 'medical';
  coordinates: { x: number; y: number };
  description?: string;
  status?: 'open' | 'closed' | 'maintenance';
}

export const campusLocations: CampusLocation[] = [
  { id: '1', name: 'Academic Block 1', category: 'academic', coordinates: { x: 25, y: 30 }, status: 'open' },
  { id: '2', name: 'Central Library', category: 'academic', coordinates: { x: 45, y: 35 }, status: 'open' },
  { id: '3', name: 'Food Court', category: 'dining', coordinates: { x: 35, y: 50 }, status: 'open' },
  { id: '4', name: 'Hostel A', category: 'hostels', coordinates: { x: 20, y: 70 }, status: 'open' },
  { id: '5', name: 'Hostel B', category: 'hostels', coordinates: { x: 15, y: 75 }, status: 'open' },
  { id: '6', name: 'Sports Complex', category: 'recreation', coordinates: { x: 70, y: 25 }, status: 'open' },
  { id: '7', name: 'Medical Center', category: 'medical', coordinates: { x: 60, y: 40 }, status: 'open' },
  { id: '8', name: 'Admin Office', category: 'admin', coordinates: { x: 50, y: 20 }, status: 'open' },
  { id: '9', name: 'Canteen', category: 'dining', coordinates: { x: 30, y: 60 }, status: 'open' },
  { id: '10', name: 'Gym', category: 'recreation', coordinates: { x: 75, y: 30 }, status: 'maintenance' },
  { id: '11', name: 'B1', category: 'academic', coordinates: { x: 10, y: 15 }, status: 'open' },
  { id: '12', name: 'B2', category: 'academic', coordinates: { x: 5, y: 10 }, status: 'open' },
  { id: '13', name: 'B3', category: 'academic', coordinates: { x: 3, y: 10 }, status: 'open' },
  { id: '14', name: 'B4', category: 'academic', coordinates: { x: 4, y: 10 }, status: 'open' },
  { id: '15', name: 'B5', category: 'academic', coordinates: { x: 5, y: 10 }, status: 'open' },
  { id: '16', name: 'B6', category: 'academic', coordinates: { x: 6, y: 10 }, status: 'open' },
  { id: '17', name: 'B7', category: 'academic', coordinates: { x: 7, y: 10 }, status: 'open' },
  { id: '18', name: 'B8', category: 'academic', coordinates: { x: 8, y: 10 }, status: 'open' },
  { id: '19', name: 'G1', category: 'academic', coordinates: { x: 9, y: 10 }, status: 'open' },
  { id: '20', name: 'G2', category: 'academic', coordinates: { x: 10, y: 10 }, status: 'open' },
  { id: '21', name: 'G3', category: 'academic', coordinates: { x: 11, y: 10 }, status: 'open' },
  { id: '22', name: 'G4', category: 'academic', coordinates: { x: 12, y: 10 }, status: 'open' },
  { id: '23', name: 'G5', category: 'academic', coordinates: { x: 13, y: 10 }, status: 'open' },
  { id: '24', name: 'Cricket Ground', category: 'recreation', coordinates: { x: 14, y: 10 }, status: 'open' },
];

export const categoryColors = {
  academic: 'hsl(var(--academic))',
  dining: 'hsl(var(--dining))',
  hostels: 'hsl(var(--hostels))',
  recreation: 'hsl(var(--recreation))',
  admin: 'hsl(var(--admin))',
  medical: 'hsl(var(--medical))',
} as const;


