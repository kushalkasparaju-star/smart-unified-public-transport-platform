
import React from 'react';
import { Screen } from '../types';
import { TRANSPORT_MODES, ICON_MAP } from '../constants';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to Public Transport Avoidance</h1>
        </div>
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all cursor-pointer">
          {ICON_MAP.User}
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-4 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <input 
            type="text" 
            placeholder="Current Location" 
            className="flex-1 text-sm font-medium text-slate-800 outline-none bg-transparent"
            defaultValue="Urban Center, Block A"
          />
        </div>
        <div className="h-px bg-slate-100 ml-5 mb-4"></div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          <input 
            onClick={() => onNavigate('routes')}
            readOnly
            type="text" 
            placeholder="Where to?" 
            className="flex-1 text-sm font-medium text-slate-400 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Access */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {['Fastest', 'Cheapest', 'Eco-friendly'].map((tag) => (
          <button 
            key={tag}
            onClick={() => onNavigate('routes')}
            className="px-4 py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 active:scale-95"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Transport Modes */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Transport Modes
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {TRANSPORT_MODES.map((mode) => (
            <div 
              key={mode.id}
              onClick={() => onNavigate('routes')}
              className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl ${mode.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {ICON_MAP[mode.icon]}
              </div>
              <p className="font-bold text-slate-900">{mode.name}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Available Now</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Trips / Suggestions */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Suggestions</h3>
          <button className="text-xs font-bold text-emerald-600 uppercase tracking-widest">See All</button>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                {ICON_MAP.Clock}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Work - Innovation Hub</p>
                <p className="text-xs text-slate-500">Every weekday at 08:30 AM</p>
              </div>
              <div className="text-emerald-600">{ICON_MAP.ChevronRight}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
