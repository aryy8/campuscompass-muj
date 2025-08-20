// Simple Google Maps JS API loader with Places library
// Ensures the script is injected only once and resolves when ready.
let mapsPromise: Promise<typeof google> | null = null;

export function loadGoogleMapsWithPlaces(apiKey?: string): Promise<typeof google> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps loader can only run in the browser'));
  }
  const existing = (window as any).google?.maps;
  if (existing && (existing as any).places) {
    return Promise.resolve((window as any).google);
  }
  if (mapsPromise) return mapsPromise;

  const key = apiKey || (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY'));
  }

  mapsPromise = new Promise((resolve, reject) => {
    // If a prior script exists, hook onload instead of re-adding
    const prior = document.querySelector('script[data-gmaps-loader="true"]') as HTMLScriptElement | null;
    if (prior) {
      if ((window as any).google?.maps?.places) {
        resolve((window as any).google);
        return;
      }
      prior.addEventListener('load', () => resolve((window as any).google), { once: true });
      prior.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.gmapsLoader = 'true';
    script.onload = () => resolve((window as any).google);
    script.onerror = () => reject(new Error('Failed to load Google Maps JS'));
    document.head.appendChild(script);
  });

  return mapsPromise;
}
