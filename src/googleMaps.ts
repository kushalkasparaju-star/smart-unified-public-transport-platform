export function loadGoogleMaps(apiKey?: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    const key = apiKey || (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) return resolve();
    if ((window as any).google && (window as any).google.maps) return resolve();

    const existing = document.querySelector(`script[data-google-maps]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google Maps load error')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps', '1');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
    document.head.appendChild(script);
  });
}
