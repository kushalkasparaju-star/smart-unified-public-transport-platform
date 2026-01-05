
import React from 'react';
import { Screen } from '../types';
import { ICON_MAP } from '../constants';

interface EcoScreenProps {
  onNavigate: (screen: Screen) => void;
}

const EcoScreen: React.FC<EcoScreenProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Your Impact</h1>
        <p className="text-slate-500 font-medium">Helping the planet, one trip at a time.</p>
      </header>

      {/* Hero Impact Stats */}
      <div className="bg-emerald-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-emerald-200 mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">CO₂ Saved This Month</p>
              <h2 className="text-5xl font-black">24.5 <span className="text-xl">kg</span></h2>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              {ICON_MAP.Leaf}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-100 uppercase mb-1">Fuel Saved</p>
              <p className="text-lg font-bold">12.3 Gal</p>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-100 uppercase mb-1">Reward Points</p>
              <p className="text-lg font-bold">1,250</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Progress */}
      <section className="mb-10 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900">Next Badge</h3>
          <span className="text-xs font-bold text-emerald-600">75% Complete</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div className="w-[75%] h-full bg-emerald-500 rounded-full"></div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Earn <span className="text-slate-900 font-bold">250 more points</span> to become an "Eco-Warrior".</p>
      </section>

      {/* Pollution Reduction Graph Mock */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Pollution Reduction</h3>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-end justify-between h-40 gap-2 mb-4">
            {[40, 60, 45, 80, 55, 95, 70].map((h, i) => (
              <div 
                key={i} 
                style={{ height: `${h}%` }} 
                className={`flex-1 rounded-t-xl transition-all duration-1000 ${i === 5 ? 'bg-emerald-500' : 'bg-slate-100 hover:bg-emerald-200'}`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h3 className="text-lg font-bold mb-4">Earned Badges</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {['Early Bird', 'Eco Traveler', 'Metro Pro'].map((badge, idx) => (
            <div key={idx} className="min-w-[120px] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
               <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  {ICON_MAP.ShieldCheck}
               </div>
               <p className="text-xs font-bold text-slate-900">{badge}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EcoScreen;
