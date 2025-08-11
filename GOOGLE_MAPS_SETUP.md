# Google Maps JavaScript API Setup for Campus Navigation

## Overview
This campus navigation system now uses Google Maps JavaScript API to provide:
- Interactive campus map with real coordinates
- Walking directions between campus locations
- Custom markers for different facility types
- Info windows with location details
- Route visualization with animated polylines

## Setup Steps

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Places API (optional, for future enhancements)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Update API Key
Replace `YOUR_API_KEY_HERE` in `src/pages/Campus.tsx`:

```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places`;
```

### 3. Configure API Key Restrictions
In Google Cloud Console:
- Set HTTP referrers to your domain
- Restrict to specific APIs (Maps JavaScript API, Directions API)
- Set usage quotas as needed

## Features Implemented

### Campus Locations
- 10 key MUJ campus locations with real coordinates
- Categorized by type (academic, dining, hostels, recreation, admin, medical)
- Status indicators (open, closed, maintenance)
- Custom colored markers for each category

### Navigation Features
- From/To location selection dropdowns
- Walking directions with Google's routing algorithm
- Route visualization with animated arrows
- Automatic map fitting to show entire route
- Distance and time information

### Interactive Elements
- Clickable markers with info windows
- Location details and descriptions
- Category-based filtering
- Responsive design for mobile and desktop

## File Structure

```
src/
├── components/campus/
│   ├── GoogleMapsCampus.tsx    # Main Google Maps component
│   ├── SearchBar.tsx           # Location search functionality
│   └── CategoryGrid.tsx        # Category filtering
├── pages/
│   ├── Campus.tsx              # Main campus exploration page
│   └── Index.tsx               # Landing page
├── types/
│   └── google-maps.d.ts        # Google Maps TypeScript definitions
└── lib/
    ├── campus-data.ts           # Campus location data
    └── shortest-path.ts         # Legacy pathfinding (can be removed)
```

## Customization

### Adding New Locations
Update `campusLocations` array in `GoogleMapsCampus.tsx`:

```typescript
{
  id: '11',
  name: 'New Building',
  category: 'academic',
  coordinates: { lat: 26.8440, lng: 75.5660 },
  status: 'open',
  description: 'Description of the new building'
}
```

### Changing Marker Colors
Update `categoryColors` object:

```typescript
const categoryColors = {
  academic: '#your-color-here',
  // ... other categories
};
```

### Modifying Map Styles
Customize map appearance in the `MapOptions`:

```typescript
styles: [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  }
  // Add more custom styles
]
```

## API Usage & Billing

### Cost Considerations
- Maps JavaScript API: $7 per 1,000 map loads
- Directions API: $5 per 1,000 requests
- Monitor usage in Google Cloud Console

### Optimization Tips
- Implement map loading only when needed
- Cache directions results
- Use appropriate zoom levels
- Consider implementing offline capabilities

## Troubleshooting

### Common Issues
1. **Map not loading**: Check API key and billing
2. **Directions not working**: Verify Directions API is enabled
3. **TypeScript errors**: Ensure `google-maps.d.ts` is included in tsconfig
4. **CORS issues**: Check domain restrictions in API key settings

### Debug Mode
Enable console logging for debugging:

```typescript
// Add to GoogleMapsCampus.tsx
console.log('Map loaded:', mapInstance.current);
console.log('Directions result:', result);
```

## Future Enhancements

### Planned Features
- Real-time location tracking
- Indoor navigation
- Accessibility features
- Multi-language support
- Offline map caching
- Integration with campus events/calendar

### API Extensions
- Street View integration
- Traffic information
- Public transit directions
- Geocoding for address search
- Places API for nearby amenities

## Support

For Google Maps API issues:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Cloud Support](https://cloud.google.com/support)

For application-specific issues:
- Check the console for error messages
- Verify API key configuration
- Ensure all required APIs are enabled
