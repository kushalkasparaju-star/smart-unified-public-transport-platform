import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
};

let analyticsInitialized = false;

export async function initAnalytics() {
  if (typeof window === 'undefined' || analyticsInitialized) return;
  try {
    const app = initializeApp(firebaseConfig as any);
    // Only enable analytics where supported (browser environments)
    if (await isSupported()) {
      getAnalytics(app);
    }
    analyticsInitialized = true;
  } catch (err) {
    // Fail silently to avoid impacting app UX
    console.warn('Firebase analytics init failed', err);
  }
}

export default initAnalytics;
