
import React from 'react';
import { Screen } from '../types';
import { ROUTE_OPTIONS, ICON_MAP } from '../constants';

interface RouteScreenProps {
  onNavigate: (screen: Screen) => void;
}

const RouteScreen: React.FC<RouteScreenProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 min-h-full bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors rotate-180"
        >
          {ICON_MAP.ArrowRight}
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Routes</h1>
      </header>

      <div className="space-y-6">
        {ROUTE_OPTIONS.map((route) => (
          <div 
            key={route.id}
            onClick={() => onNavigate('tracking')}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group active:scale-[0.98]"
          >
            {/* Eco Badge */}
            <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-bold rounded-bl-3xl ${
              route.label === 'Eco-friendly' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {route.label}
            </div>

            <div className="flex justify-between items-start mb-6 pt-4">
              <div className="flex gap-2">
                {route.modes.map((mode, idx) => (
                  <React.Fragment key={idx}>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                      {ICON_MAP[mode === 'Metro' ? 'Train' : 'Bus']}
                    </div>
                    {idx < route.modes.length - 1 && (
                      <div className="self-center text-slate-300 dark:text-slate-600">
                        {ICON_MAP.ChevronRight}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{route.cost.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Fare</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-bold">
                <span className="opacity-70">{ICON_MAP.Clock}</span> {route.duration}
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold">
                <span className="opacity-70">{ICON_MAP.Leaf}</span> {route.ecoScore}% Eco
              </div>
            </div>

            <div className="h-px bg-slate-50 dark:bg-slate-800 mb-6"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Leaves in 4 mins</span>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                Book Ticket {ICON_MAP.ArrowRight}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        All fares are shown in Indian Rupees (₹)
      </p>
    </div>
  );
};

export default RouteScreen;
