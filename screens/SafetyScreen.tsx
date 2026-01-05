
import React, { useState } from 'react';
import { Screen } from '../types';
import { ICON_MAP } from '../constants';

interface SafetyScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SafetyScreen: React.FC<SafetyScreenProps> = ({ onNavigate }) => {
  const [voiceNav, setVoiceNav] = useState(false);
  const [wheelchairFilter, setWheelchairFilter] = useState(false);

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Safety Center</h1>
        <p className="text-slate-500 font-medium">Your protection is our priority.</p>
      </header>

      {/* SOS Button */}
      <div className="mb-10">
        <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-[3rem] p-10 shadow-2xl shadow-red-200 flex flex-col items-center gap-4 transition-all active:scale-95 group">
           <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse group-hover:bg-white/30">
              <span className="text-4xl font-black">SOS</span>
           </div>
           <div className="text-center">
              <p className="text-xl font-bold">Emergency Alert</p>
              <p className="text-sm opacity-80">Notify police & emergency contacts</p>
           </div>
        </button>
      </div>

      {/* Quick Safety Actions */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        <button className="flex items-center gap-5 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-emerald-500 transition-colors">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
            {ICON_MAP.Users}
          </div>
          <div className="text-left flex-1">
            <p className="font-bold text-slate-900">Women Safety Alert</p>
            <p className="text-xs text-slate-400">Share live location with emergency list</p>
          </div>
          <div className="text-slate-300">{ICON_MAP.ChevronRight}</div>
        </button>

        <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                </div>
                <p className="font-bold text-slate-900">Voice Navigation</p>
             </div>
             <div 
               onClick={() => setVoiceNav(!voiceNav)}
               className={`w-14 h-8 rounded-full transition-colors cursor-pointer relative ${voiceNav ? 'bg-emerald-500' : 'bg-slate-200'}`}
             >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${voiceNav ? 'left-7' : 'left-1'}`}></div>
             </div>
          </div>
          <p className="text-xs text-slate-400">Audio guidance for visually impaired users.</p>
        </div>

        <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <p className="font-bold text-slate-900">Wheelchair Filter</p>
             </div>
             <div 
               onClick={() => setWheelchairFilter(!wheelchairFilter)}
               className={`w-14 h-8 rounded-full transition-colors cursor-pointer relative ${wheelchairFilter ? 'bg-emerald-500' : 'bg-slate-200'}`}
             >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${wheelchairFilter ? 'left-7' : 'left-1'}`}></div>
             </div>
          </div>
          <p className="text-xs text-slate-400">Prioritize ramps and accessible elevators.</p>
        </div>
      </div>

      <section className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl">
        <h3 className="font-bold mb-4">Emergency Contacts</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Police</span>
            <span className="font-mono font-bold">911</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Ambulance</span>
            <span className="font-mono font-bold">102</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Women Helpline</span>
            <span className="font-mono font-bold">1091</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyScreen;
