export type LocationLabel = {
  id: string;
  name: string;
  category: 'Academic' | 'Dining' | 'Hostels' | 'Recreation' | 'Admin' | 'Medical';
};

// Keep this in sync with map markers in GoogleMapsCampus.tsx
export const locationLabels: LocationLabel[] = [
  // B-blocks
  { id: '11', name: 'B1', category: 'Academic' },
  { id: '12', name: 'B2', category: 'Academic' },
  { id: '13', name: 'B3', category: 'Academic' },
  { id: '14', name: 'B4', category: 'Academic' },
  { id: '15', name: 'B5', category: 'Academic' },
  { id: '16', name: 'B6', category: 'Academic' },
  { id: '17', name: 'B7', category: 'Academic' },
  { id: '18', name: 'B8', category: 'Academic' },

  // G-blocks
  { id: '19', name: 'G1', category: 'Academic' },
  { id: '20', name: 'G2', category: 'Academic' },
  { id: '21', name: 'G3', category: 'Academic' },
  { id: '22', name: 'G4', category: 'Academic' },
  { id: '23', name: 'G5', category: 'Academic' },

  // Recreation
  { id: '24', name: 'Cricket Ground', category: 'Recreation' },
  { id: '25', name: 'grand stairs', category: 'Recreation' },
  { id: '36', name: 'Joggers park', category: 'Recreation' },
  { id: '41', name: 'Court', category: 'Recreation' },

  // Academic named buildings
  { id: '26', name: 'AB 2', category: 'Academic' },
  { id: '27', name: 'AB 1', category: 'Academic' },
  { id: '28', name: 'AB 4', category: 'Academic' },
  { id: '29', name: 'AB 3', category: 'Academic' },
  { id: '30', name: 'Vasanti Pai audi', category: 'Academic' },
  { id: '31', name: 'Sharda Pai audi', category: 'Academic' },
  { id: '32', name: 'TMA Pai audi', category: 'Academic' },
  { id: '44', name: 'library', category: 'Academic' },

  // Dining
  { id: '33', name: 'Old mess', category: 'Dining' },
  { id: '34', name: 'Blue spring', category: 'Dining' },
  { id: '35', name: 'Blue dove', category: 'Dining' },
  { id: '37', name: 'Tandoor', category: 'Dining' },
  { id: '38', name: 'Jaipur bakers', category: 'Dining' },
  { id: '42', name: 'Subway', category: 'Dining' },

  // Admin/Services
  { id: '39', name: 'Laundry', category: 'Admin' },
  { id: '40', name: 'GHS office', category: 'Admin' },
  { id: '43', name: 'cab rent', category: 'Admin' },
]; 