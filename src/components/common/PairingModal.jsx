import React, { useState } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import { Wifi, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PairingModal() {
  const { isPairingModalOpen, setIsPairingModalOpen, pairNewScreen } = useScreenFlow();

  const [pairingCode, setPairingCode] = useState('');
  const [screenName, setScreenName] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPairingModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pairingCode.trim()) return;

    setIsSubmitting(true);
    try {
      await pairNewScreen(pairingCode, screenName, location);
      setPairingCode('');
      setScreenName('');
      setLocation('');
    } catch (err) {
      // Error handled inside context toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Pair LED Screen Device</h3>
              <p className="text-xs text-slate-400">Connect dedicated media player hardware</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPairingModalOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-blue-900/20 border border-blue-500/30 text-xs text-blue-300 leading-relaxed">
          Check your physical LED screen on first power-up. Enter the 6-digit pairing code shown on screen (e.g. <strong className="font-mono text-white">SF-9012</strong>).
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">6-Digit Pairing Code</label>
            <input
              type="text"
              required
              maxLength={8}
              placeholder="e.g. SF-9012"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-emerald-400 focus:outline-none focus:border-blue-500 font-bold uppercase"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Display Name</label>
            <input
              type="text"
              placeholder="e.g. West Concourse Video Ribbon"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Terminal 2, Gate 15"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsPairingModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying Hardware...' : 'Pair LED Player'}
          </button>
        </div>
      </form>
    </div>
  );
}
