'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Alert } from '@mui/material';

const MapComponent = ({ onLocationSelect, initialLocation, markers = [] }) => {
  const [map, setMap] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [error, setError] = useState('');

  // Define initializeMap with useCallback to avoid dependency issues
  const initializeMap = useCallback(() => {
    const google = window.google;
    
    // Use setTimeout to make state updates asynchronous
    setTimeout(() => {
      setGoogleMaps(google);

      const defaultLocation = initialLocation || { lat: 12.9716, lng: 77.5946 };
      
      const mapInstance = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false
      });

      // Add click listener for location selection
      if (onLocationSelect) {
        mapInstance.addListener('click', (event) => {
          const location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          onLocationSelect(location);
          
          new google.maps.Marker({
            position: location,
            map: mapInstance,
            title: 'Selected Location'
          });
        });
      }

      // Add existing markers
      markers.forEach(marker => {
        new google.maps.Marker({
          position: { lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) },
          map: mapInstance,
          title: marker.title
        });
      });

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            mapInstance.setCenter(userLocation);
            
            new google.maps.Marker({
              position: userLocation,
              map: mapInstance,
              title: 'Your Location',
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }
            });
          },
          () => {
            console.log('Geolocation failed, using default location');
          }
        );
      }

      setMap(mapInstance);
    }, 0);
  }, [initialLocation, onLocationSelect, markers]); // Add dependencies

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [initializeMap]); // Now include initializeMap in dependencies

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Issue Location
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click on the map to set the exact location of the issue
      </Typography>
      <Box 
        id="map" 
        sx={{ 
          height: 400, 
          width: '100%', 
          borderRadius: 1,
          border: '1px solid #ddd'
        }} 
      />
    </Box>
  );
};

export default MapComponent;