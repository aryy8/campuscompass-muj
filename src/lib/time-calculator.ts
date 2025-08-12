export interface TimeCalculation {
  distance: number; // in meters
  walkingTime: number; // in minutes
  runningTime: number; // in minutes
  cyclingTime: number; // in minutes
  wheelchairTime: number; // in minutes
  formattedDistance: string;
  formattedWalkingTime: string;
  formattedRunningTime: string;
  formattedCyclingTime: string;
  formattedWheelchairTime: string;
  estimatedArrival: {
    walking: string;
    running: string;
    cycling: string;
    wheelchair: string;
  };
}

export interface Location {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  category: string;
  status?: 'open' | 'closed' | 'maintenance';
}

// Transportation speeds (in km/h)
const SPEEDS = {
  walking: 5, // 5 km/h - average walking speed
  running: 12, // 12 km/h - average jogging speed
  cycling: 15, // 15 km/h - average cycling speed on campus
  wheelchair: 4, // 4 km/h - average wheelchair speed
} as const;

// Terrain factors (multipliers for different areas)
const TERRAIN_FACTORS = {
  academic: 1.0, // Normal walking paths
  dining: 1.0, // Normal walking paths
  hostels: 1.1, // Slightly hilly areas
  recreation: 1.2, // Sports areas might have more obstacles
  admin: 1.0, // Normal walking paths
  medical: 1.0, // Normal walking paths
} as const;

// Time of day factors (rush hours, etc.)
const TIME_FACTORS = {
  morning: 1.1, // 8-10 AM - more crowded
  afternoon: 1.0, // 10 AM - 4 PM - normal
  evening: 1.15, // 4-6 PM - rush hour
  night: 0.9, // 6 PM - 8 AM - less crowded
} as const;

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Convert to meters
};

// Get current time period
const getTimePeriod = (): keyof typeof TIME_FACTORS => {
  const hour = new Date().getHours();
  if (hour >= 8 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 18) return 'evening';
  return 'night';
};

// Format time in a human-readable way
const formatTime = (minutes: number): string => {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

// Format distance in a human-readable way
const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

// Calculate estimated arrival time
const calculateArrivalTime = (minutes: number): string => {
  const now = new Date();
  const arrival = new Date(now.getTime() + minutes * 60 * 1000);
  return arrival.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Main time calculation function
export const calculateTimeBetweenLocations = (
  startLocation: Location,
  endLocation: Location
): TimeCalculation => {
  // Calculate base distance
  const distance = calculateDistance(
    startLocation.coordinates.lat,
    startLocation.coordinates.lng,
    endLocation.coordinates.lat,
    endLocation.coordinates.lng
  );

  // Get terrain factor based on destination category
  const terrainFactor = TERRAIN_FACTORS[endLocation.category as keyof typeof TERRAIN_FACTORS] || 1.0;
  
  // Get time of day factor
  const timeFactor = TIME_FACTORS[getTimePeriod()];

  // Calculate times for different transportation modes
  const walkingTime = (distance / 1000 / SPEEDS.walking) * 60 * terrainFactor * timeFactor;
  const runningTime = (distance / 1000 / SPEEDS.running) * 60 * terrainFactor * timeFactor;
  const cyclingTime = (distance / 1000 / SPEEDS.cycling) * 60 * terrainFactor * timeFactor;
  const wheelchairTime = (distance / 1000 / SPEEDS.wheelchair) * 60 * terrainFactor * timeFactor * 1.2; // Additional factor for accessibility

  return {
    distance,
    walkingTime,
    runningTime,
    cyclingTime,
    wheelchairTime,
    formattedDistance: formatDistance(distance),
    formattedWalkingTime: formatTime(walkingTime),
    formattedRunningTime: formatTime(runningTime),
    formattedCyclingTime: formatTime(cyclingTime),
    formattedWheelchairTime: formatTime(wheelchairTime),
    estimatedArrival: {
      walking: calculateArrivalTime(walkingTime),
      running: calculateArrivalTime(runningTime),
      cycling: calculateArrivalTime(cyclingTime),
      wheelchair: calculateArrivalTime(wheelchairTime),
    }
  };
};

// Calculate time for multiple waypoints
export const calculateMultiPointTime = (locations: Location[]): TimeCalculation => {
  if (locations.length < 2) {
    throw new Error('At least 2 locations required for time calculation');
  }

  let totalDistance = 0;
  let totalWalkingTime = 0;
  let totalRunningTime = 0;
  let totalCyclingTime = 0;
  let totalWheelchairTime = 0;

  for (let i = 0; i < locations.length - 1; i++) {
    const current = locations[i];
    const next = locations[i + 1];
    const calculation = calculateTimeBetweenLocations(current, next);
    
    totalDistance += calculation.distance;
    totalWalkingTime += calculation.walkingTime;
    totalRunningTime += calculation.runningTime;
    totalCyclingTime += calculation.cyclingTime;
    totalWheelchairTime += calculation.wheelchairTime;
  }

  return {
    distance: totalDistance,
    walkingTime: totalWalkingTime,
    runningTime: totalRunningTime,
    cyclingTime: totalCyclingTime,
    wheelchairTime: totalWheelchairTime,
    formattedDistance: formatDistance(totalDistance),
    formattedWalkingTime: formatTime(totalWalkingTime),
    formattedRunningTime: formatTime(totalRunningTime),
    formattedCyclingTime: formatTime(totalCyclingTime),
    formattedWheelchairTime: formatTime(totalWheelchairTime),
    estimatedArrival: {
      walking: calculateArrivalTime(totalWalkingTime),
      running: calculateArrivalTime(totalRunningTime),
      cycling: calculateArrivalTime(totalCyclingTime),
      wheelchair: calculateArrivalTime(totalWheelchairTime),
    }
  };
};

// Get time-based recommendations
export const getTimeRecommendations = (calculation: TimeCalculation): string[] => {
  const recommendations: string[] = [];

  if (calculation.walkingTime > 15) {
    recommendations.push('Consider cycling for faster travel');
  }

  if (calculation.walkingTime > 30) {
    recommendations.push('This is a long walk - plan accordingly');
  }

  if (calculation.walkingTime < 5) {
    recommendations.push('Quick walk - no special preparation needed');
  }

  const timePeriod = getTimePeriod();
  if (timePeriod === 'evening') {
    recommendations.push('Evening rush hour - allow extra time');
  }

  if (timePeriod === 'night') {
    recommendations.push('Night time - ensure well-lit paths');
  }

  return recommendations;
}; 