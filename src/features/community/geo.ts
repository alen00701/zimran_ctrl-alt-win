/** "Near you" helpers: distance from the visitor to a venue. Pure functions are tested in community.test.ts. */
import { useCallback, useEffect, useState } from 'react';
import type { Coords } from './content';

const EARTH_RADIUS_MILES = 3958.8;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in miles (haversine). */
export function milesBetween(a: Coords, b: Coords): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** "Less than a mile from you", "12 mi from you", "6,912 mi from you". */
export function distanceLabel(miles: number): string {
  if (miles < 1) return 'Less than a mile from you';
  return `${Math.round(miles).toLocaleString('en-US')} mi from you`;
}

/** Nearest first. Stable for equal distances. */
export function sortByDistance<T extends { venue: { coords: Coords } }>(items: readonly T[], from: Coords): T[] {
  return items
    .map((item, i) => ({ item, i, d: milesBetween(from, item.venue.coords) }))
    .sort((x, y) => x.d - y.d || x.i - y.i)
    .map((x) => x.item);
}

export type ViewerLocation =
  | { status: 'idle' | 'locating' | 'unavailable'; coords: null }
  | { status: 'ready'; coords: Coords };

/**
 * The visitor's location, only after they ask for it (or already allowed it for this site).
 * Kept in memory for this visit: it is never saved or sent anywhere.
 */
export function useViewerLocation(): ViewerLocation & { request: () => void } {
  const [loc, setLoc] = useState<ViewerLocation>({ status: 'idle', coords: null });

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLoc({ status: 'unavailable', coords: null });
      return;
    }
    setLoc({ status: 'locating', coords: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ status: 'ready', coords: { lat: pos.coords.latitude, lon: pos.coords.longitude } }),
      () => setLoc({ status: 'unavailable', coords: null }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600_000 },
    );
  }, []);

  // If the visitor already allowed location for this site, use it without another tap.
  useEffect(() => {
    let cancelled = false;
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((p) => {
        if (!cancelled && p.state === 'granted') request();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [request]);

  return { ...loc, request };
}
