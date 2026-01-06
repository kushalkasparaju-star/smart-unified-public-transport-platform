import React, { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../src/googleMaps';
import { Screen } from '../types';
import { ICON_MAP } from '../constants';

interface TrackingScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TrackingScreen: React.FC<TrackingScreenProps> = ({ onNavigate }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    // Lazy-load Google Maps and initialize a simple static map
    loadGoogleMaps()
      .then(() => {
        if (!mounted) return;

        const google = (window as any).google;
        if (google && google.maps && mapRef.current) {
          // Default location (no GPS, no live tracking)
          const center = { lat: 6.5244, lng: 3.3792 }; // Lagos

          new google.maps.Map(mapRef.current, {
            center,
            zoom: 12,
            disableDefaultUI: true,
            gestureHandling: 'none',
          });
        }
      })
      .catch(() => {
        // Fail silently — UI fallback remains
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-slate-200 z-0">
        <div ref={mapRef} className="w-full h-full" aria-hidden="true" />
        <div className="absolute inset-0 w-full h-full opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Mock Routes */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 50 400 Q 150 350 200 200 T 350 100"
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            className="opacity-50"
          />
          <path
            d="M 10 300 Q 100 250 180 300 T 400 350"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="6"
            strokeLinecap="round"
            className="opacity-30"
          />
        </svg>

        {/* Animated Marker */}
        <div className="absolute top-[200px] left-[200px] w-12 h-12 bg-emerald-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white animate-bounce">
          {ICON_MAP.Bus}
        </div>
      </div>

      {/* Header Overlay */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <button
          onClick={() => onNavigate('routes')}
          className="p-4 bg-white rounded-2xl shadow-xl text-slate-600 hover:text-emerald-600 transition-all rotate-180"
        >
          {ICON_MAP.ArrowRight}
        </button>

        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-900">
              LIVE TRACKING
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Tracking Card */}
      <div className="mt-auto relative z-10 p-6">
        <div className="bg-white rounded-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] p-8 border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                Route 42B
              </h2>
              <p className="text-sm font-medium text-slate-400">
                Heading to Metro Central
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black text-emerald-600">08:12</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Arrival ETA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-3xl text-center border border-slate-100">
              <div className="text-blue-500 flex justify-center mb-2">
                {ICON_MAP.Users}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Crowd
              </p>
              <p className="text-sm font-bold text-slate-800">Low</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-3xl text-center border border-slate-100">
              <div className="text-emerald-500 flex justify-center mb-2">
                {ICON_MAP.Zap}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Status
              </p>
              <p className="text-sm font-bold text-slate-800">On-Time</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-3xl text-center border border-slate-100">
              <div className="text-amber-500 flex justify-center mb-2">
                {ICON_MAP.AlertCircle}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Delay
              </p>
              <p className="text-sm font-bold text-slate-800">None</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('booking')}
            className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
          >
            {ICON_MAP.CreditCard} Secure My Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingScreen;

