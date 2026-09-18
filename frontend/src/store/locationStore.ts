import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  currentAddress: string;
  cityName: string;
  latitude: number | null;
  longitude: number | null;
  isDetected: boolean;
  setLocation: (address: string, city?: string, lat?: number | null, lng?: number | null) => void;
  detectLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentAddress: 'Select your delivery location',
      cityName: 'Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      isDetected: false,
      setLocation: (address, city = 'Bangalore', lat = 12.9716, lng = 77.5946) =>
        set({
          currentAddress: address,
          cityName: city,
          latitude: lat,
          longitude: lng,
          isDetected: true,
        }),
      detectLocation: async () => {
        return new Promise((resolve) => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                // Simulated reverse geocode for fast local experience
                set({
                  latitude,
                  longitude,
                  currentAddress: 'Current GPS Location (MG Road, Central)',
                  cityName: 'Bangalore',
                  isDetected: true,
                });
                resolve();
              },
              () => {
                // Fallback default
                set({
                  currentAddress: '12 MG Road, Central District',
                  cityName: 'Bangalore',
                  latitude: 12.9716,
                  longitude: 77.5946,
                  isDetected: true,
                });
                resolve();
              }
            );
          } else {
            set({
              currentAddress: '12 MG Road, Central District',
              cityName: 'Bangalore',
              latitude: 12.9716,
              longitude: 77.5946,
              isDetected: true,
            });
            resolve();
          }
        });
      },
    }),
    {
      name: 'location-storage',
    }
  )
);
