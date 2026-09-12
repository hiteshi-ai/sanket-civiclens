/**
 * Approximate user location for the Citizen map.
 *
 * Privacy & UX rules:
 * - Never requests geolocation automatically; only on explicit user action.
 * - Falls back gracefully (map still fully works without it).
 * - Only the user's OWN approximate location is ever shown — never other
 *   citizens' locations.
 */
import { useCallback, useState } from 'react';

export type LocationStatus = 'idle' | 'locating' | 'granted' | 'unavailable';

export const useCitizenLocation = () => {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [coords, setCoords] = useState<[number, number] | null>(null);

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords([position.coords.latitude, position.coords.longitude]);
        setStatus('granted');
      },
      () => setStatus('unavailable'),
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return { status, coords, request };
};

/** Time-aware greeting for the home header. */
export const greetingForNow = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};