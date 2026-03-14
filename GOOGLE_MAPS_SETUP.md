# Google Maps Location Tracking Setup Guide

This guide will help you set up the Google Maps Location Picker for AI image generation in your project.

## Overview

The Google Maps Location Picker component replaces the simple text input for project locations with an interactive location selector that provides:

- **Exact Coordinates**: Tracks latitude and longitude for precise location data
- **Address Autocomplete**: Real-time suggestions as you type
- **Current Location**: One-click access to user's current GPS location
- **Reverse Geocoding**: Converts coordinates back to human-readable addresses

## Step 1: Get Google Maps API Key

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable billing for the project

### 1.2 Enable Required APIs

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for and enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**

### 1.3 Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy your API key
4. (Optional) Restrict the key to:
   - **Application restrictions**: HTTP referrers
   - **Add referrer**: `localhost:3001` (for development) and your production domain
   - **API restrictions**: Select the three APIs enabled above

## Step 2: Configure Environment Variables

### 2.1 Update .env.local

Create or update your `.env.local` file in the project root:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8002
```

### 2.2 Update .env.example

The `.env.example` has been updated with:

```bash
# Google Maps API Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Step 3: Component Integration

### 3.1 How It Works

The Google Maps Location Picker is now integrated into the **Create New Project** form at:
- File: `app/dashboard/new-project/page.tsx`
- Component: `GoogleMapsLocationPicker` from `components/google-maps-location-picker.tsx`

### 3.2 Features

When creating a new project, the location form field now provides:

1. **Search Box**: Type location name or address
2. **Autocomplete Suggestions**: Real-time suggestions from Google Places API
3. **Current Location Button**: Click the location pin icon to auto-detect your current position
4. **Coordinates Display**: Shows exact latitude and longitude after selection
5. **Formatted Address**: Displays the complete formatted address

### 3.3 Data Structure

Selected location data is stored in the project with:

```typescript
{
  address: string;              // User-friendly address
  latitude: number;             // Exact latitude
  longitude: number;            // Exact longitude
  placeId?: string;            // Google Places ID
  formattedAddress?: string;   // Complete formatted address
}
```

This is saved in the `projectData.coordinates` field during project creation.

## Step 4: Testing

### 4.1 Local Development

1. Start your frontend:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard: `http://localhost:3001/dashboard`

3. Create a new project

4. In Step 2 (Project Details), test the location picker:
   - Type a city name (e.g., "Mumbai")
   - Select from suggestions
   - Or click the location pin to use your current position

### 4.2 Verification

After selecting a location, you should see:
- The formatted address displayed
- Exact coordinates (latitude and longitude) shown below the address
- The "Continue to Requirements" button becomes active

## Step 5: Using Location Data in Design Generation

The exact coordinates are now included in the project data sent to the AI design generation API:

```typescript
projectData: {
  // ... other fields
  coordinates: {
    latitude: 19.0760,
    longitude: 72.8777,
    formattedAddress: "Mumbai, Maharashtra, India"
  }
}
```

### 5.1 Future Enhancements

The coordinates can be used for:

1. **Climate-Aware Designs**: Adjust materials/ventilation based on regional climate
2. **Building Regulations**: Apply location-specific building codes
3. **Terrain Analysis**: Factor in local elevation, soil type, etc.
4. **Regional Aesthetics**: Match local architectural styles
5. **Sunlight Optimization**: Calculate sun angles specific to latitude/longitude
6. **Cost Estimation**: Use exact location for precise material and labor costs

## Step 6: Troubleshooting

### Issue: "Google Maps service not available"

**Solution:**
- Ensure API key is correctly set in `.env.local`
- Verify the three required APIs are enabled in Google Cloud Console
- Check browser console for CORS errors
- Restart the development server after updating environment variables
> **Note:** the picker now gracefully falls back to a plain address entry if Google services fail or are unreachable. Simply type your location, then press **Enter**, move focus away, or click "Get Budget"; the form will proceed using the text you entered (coordinates will default to `0,0`).
### Issue: Autocomplete suggestions not appearing

**Solution:**
- Verify API key has Places API enabled
- Check for rate limiting (Google Cloud Console → Quotas)
- Ensure you have billing enabled in Google Cloud

### Issue: "Geolocation not supported"

**Solution:**
- This is browser-specific (not all browsers support geolocation)
- Https is typically required for geolocation (localhost is an exception)
- User must grant permission when prompted

### Issue: Coordinates not saving

**Solution:**
- Check that `locationData` is properly set in the form state
- Verify the project data includes the `coordinates` field
- Check browser console for errors during project creation

## Step 7: File Changes Summary

This integration added/modified the following files:

### New Files:
- `components/google-maps-location-picker.tsx` - Main location picker component

### Modified Files:
- `app/dashboard/new-project/page.tsx` - Integrated location picker
- `.env.example` - Added Google Maps API key configuration

### No Changes To:
- Other project files (form structure, dashboard, designs, etc. remain unchanged)
- Backend API (still uses location string, now also receives coordinates)
- Other components and routes

## Step 8: Deployment

### For Production:

1. **Get Production API Key**:
   - Create a new API key in Google Cloud Console
   - Restrict it to your production domain
   - Ensure HTTP referrer restriction includes your domain

2. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_production_api_key
   ```

3. **Verify Security**:
   - API key restriction to HTTP referrers only (not browser restriction)
   - Only required APIs enabled
   - Billing alert set up in Google Cloud Console

4. **Monitor Usage**:
   - Google Cloud Console → APIs & Services → Quotas
   - Set up usage alerts to avoid unexpected charges

## Step 9: API Costs

Google Maps APIs are usage-based. Typical costs:
- **Maps JavaScript API**: $0.007 per request (first 28,000 loads free)
- **Places API (Autocomplete)**: $0.03 per request
- **Geocoding API**: $0.005 per request

Set up a monthly budget alert in Google Cloud Console to avoid surprise charges.

## Support & Documentation

- [Google Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)

## Questions or Issues?

For implementation issues or questions about the location picker component, refer to:
- Component documentation in `components/google-maps-location-picker.tsx`
- Integration in `app/dashboard/new-project/page.tsx`
