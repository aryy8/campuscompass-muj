import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  Bike, 
  User, 
  Accessibility,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TimeCalculation, 
  calculateTimeBetweenLocations, 
  getTimeRecommendations,
  type Location 
} from '@/lib/time-calculator';

interface TimeCalculatorProps {
  startLocation: Location | null;
  endLocation: Location | null;
  className?: string;
}

const TimeCalculator: React.FC<TimeCalculatorProps> = ({ 
  startLocation, 
  endLocation, 
  className = '' 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (!startLocation || !endLocation) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select start and destination locations to see travel times</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculation = calculateTimeBetweenLocations(startLocation, endLocation);
  const recommendations = getTimeRecommendations(calculation);

  const transportationModes = [
    {
      name: 'Walking',
      icon: User,
      time: calculation.formattedWalkingTime,
      arrival: calculation.estimatedArrival.walking,
      color: 'bg-blue-500',
      description: 'Standard walking pace'
    },
    {
      name: 'Running',
      icon: TrendingUp,
      time: calculation.formattedRunningTime,
      arrival: calculation.estimatedArrival.running,
      color: 'bg-green-500',
      description: 'Jogging pace'
    },
    {
      name: 'Cycling',
      icon: Bike,
      time: calculation.formattedCyclingTime,
      arrival: calculation.estimatedArrival.cycling,
      color: 'bg-purple-500',
      description: 'Bicycle travel'
    },
    {
      name: 'Wheelchair',
      icon: Accessibility,
      time: calculation.formattedWheelchairTime,
      arrival: calculation.estimatedArrival.wheelchair,
      color: 'bg-orange-500',
      description: 'Accessible route'
    }
  ];

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();
  const timeOfDayLabels = {
    morning: 'Morning',
    afternoon: 'Afternoon', 
    evening: 'Evening',
    night: 'Night'
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Time Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-blue-900">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
            <div className="text-sm text-blue-700">
              {timeOfDayLabels[timeOfDay]} • {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Summary Card */}
      <Card className="border-2 border-primary/20 shadow-medium">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Navigation className="h-5 w-5 text-primary" />
            Route Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>From:</span>
              </div>
              <div className="font-medium text-foreground">{startLocation.name}</div>
              <Badge variant="outline" className="text-xs">
                {startLocation.category}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>To:</span>
              </div>
              <div className="font-medium text-foreground">{endLocation.name}</div>
              <Badge variant="outline" className="text-xs">
                {endLocation.category}
              </Badge>
            </div>
          </div>

          {/* Distance and Current Time */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{calculation.formattedDistance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {timeOfDayLabels[timeOfDay]}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transportation Modes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Travel Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {transportationModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.name}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${mode.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{mode.name}</div>
                      <div className="text-sm text-muted-foreground">{mode.description}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="font-semibold text-foreground">{mode.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Arrival:</span>
                      <span className="font-medium text-foreground">{mode.arrival}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
              <AlertCircle className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-amber-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Set Reminder
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Save Route
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Navigation className="h-3 w-3 mr-1" />
              Start Navigation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Notice */}
      <div className="lg:hidden">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Smartphone className="h-4 w-4" />
              <span>Tap locations on the map to update route</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeCalculator; 