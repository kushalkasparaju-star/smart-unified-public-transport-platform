
import React, { useState } from 'react';
import { Screen } from '../types';
import { ICON_MAP } from '../constants';

interface BookingScreenProps {
  onNavigate: (screen: Screen) => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'pay' | 'success'>('pay');
  const [selectedMethod, setSelectedMethod] = useState('upi');

  if (step === 'success') {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Ticket Confirmed!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-[240px]">Your ride from Urban Center to Metro Central is secured.</p>
        
        <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 mb-10 w-full flex flex-col items-center shadow-inner">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm mb-4">
             <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                {ICON_MAP.QrCode}
             </div>
          </div>
          <p className="font-mono text-sm tracking-widest text-slate-400 dark:text-slate-500 uppercase">TRK-990-234-AD1</p>
          <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">SMS ticket sent to +91 98••• ••090</div>
        </div>

        <button 
          onClick={() => onNavigate('home')}
          className="w-full py-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-3xl font-bold transition-all shadow-lg active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('tracking')}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors rotate-180"
        >
          {ICON_MAP.ArrowRight}
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Checkout</h1>
      </header>

      {/* Fare Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Fare Breakdown (INR)</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Base Fare (Metro)</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">₹2,490</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">First-mile (Bus)</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">₹996</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Service Fee</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">₹249</span>
          </div>
          <div className="h-px bg-slate-50 dark:bg-slate-800 my-2"></div>
          <div className="flex justify-between">
            <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
            <span className="text-xl font-black text-emerald-600">₹3,735</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Method</h3>
        <div className="space-y-3">
          {[
            { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: 'Zap' },
            { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
            { id: 'wallet', name: 'Digital Wallet', icon: 'LayoutDashboard' }
          ].map((method) => (
            <div 
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === method.id 
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' 
                : 'border-white dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${selectedMethod === method.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {ICON_MAP[method.icon]}
                </div>
                <span className={`font-bold text-sm ${selectedMethod === method.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                  {method.name}
                </span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id ? 'border-emerald-500' : 'border-slate-200 dark:border-slate-700'
              }`}>
                {selectedMethod === method.id && <div className="w-3 h-3 rounded-full bg-emerald-500"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 text-center mb-4 uppercase font-bold tracking-tighter">
          By clicking pay you agree to the Terms of Service
        </p>
        <button 
          onClick={() => setStep('success')}
          className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-200 dark:shadow-emerald-900/20 active:scale-95 transition-all"
        >
          Pay ₹3,735 Now
        </button>
      </div>
    </div>
  );
};

export default BookingScreen;
