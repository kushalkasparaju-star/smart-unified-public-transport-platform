import React, { useState } from 'react';

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'askDestination' | 'askPriority' | 'showResult'>('askDestination');
  const [destination, setDestination] = useState('');
  const [priority, setPriority] = useState<'Fastest' | 'Cheapest' | 'Eco-friendly' | 'Safe' | ''>('');
  const [result, setResult] = useState<null | {mode: string; time: string; cost: string; eco: string}>(null);

  const openChat = () => {
    setOpen(true);
    setStep('askDestination');
    setDestination('');
    setPriority('');
    setResult(null);
  };

  const closeChat = () => {
    setOpen(false);
  };

  const submitDestination = () => {
    if (destination.trim() === '') return;
    setStep('askPriority');
  };

  const submitPriority = () => {
    if (!priority) return;
    // Very small deterministic suggestion logic (local only)
    let mode = 'Bus';
    let time = '25 mins';
    let cost = '₹40';
    let eco = 'Good';

    if (priority === 'Fastest') {
      mode = 'Metro';
      time = '12 mins';
      cost = '₹60';
      eco = 'Moderate';
    } else if (priority === 'Cheapest') {
      mode = 'Bus';
      time = '30 mins';
      cost = '₹25';
      eco = 'Good';
    } else if (priority === 'Eco-friendly') {
      mode = 'Bus';
      time = '35 mins';
      cost = '₹30';
      eco = 'Best';
    } else if (priority === 'Safe') {
      mode = 'Auto';
      time = '20 mins';
      cost = '₹80';
      eco = 'Low';
    }

    setResult({ mode, time, cost, eco });
    setStep('showResult');
  };

  return (
    <>
      {/* Floating icon button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={openChat}
            aria-label="Open chat"
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.88L3 20l1.12-3.19A7.97 7.97 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}

        {/* Bottom sheet modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={closeChat} />
            <div className="relative w-full max-w-xl mx-4 mb-6 bg-white dark:bg-slate-900 rounded-t-xl shadow-2xl overflow-hidden transition-transform transform translate-y-0"
                 style={{ maxHeight: '60vh' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Travel Assistant</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setStep('askDestination'); setDestination(''); setPriority(''); setResult(null); }}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Back
                  </button>
                  <button onClick={closeChat} aria-label="Close chat" className="text-slate-500 hover:text-slate-700">
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(60vh - 56px)' }}>
                {step === 'askDestination' && (
                  <div className="space-y-3">
                    <div className="text-sm text-slate-700 dark:text-slate-300">Where are you going?</div>
                    <input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <button onClick={submitDestination} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Next</button>
                    </div>
                  </div>
                )}

                {step === 'askPriority' && (
                  <div className="space-y-3">
                    <div className="text-sm text-slate-700 dark:text-slate-300">What is your priority?</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Fastest','Cheapest','Eco-friendly','Safe'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`px-3 py-2 rounded-lg border ${priority===p? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'} text-sm`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button onClick={submitPriority} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Suggest</button>
                    </div>
                  </div>
                )}

                {step === 'showResult' && result && (
                  <div className="space-y-3">
                    <div className="text-sm text-slate-700 dark:text-slate-300">Suggestion</div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{result.mode}</div>
                        <div className="text-xs text-slate-500">{result.time}</div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Cost: {result.cost}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Environment: {result.eco}</div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setStep('askPriority'); setResult(null); }} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">Change</button>
                      <button onClick={closeChat} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Done</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;
