import React, { useState } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import {
  Radio,
  AlertTriangle,
  Tv,
  Megaphone,
  Video,
  Info,
  CheckCircle2,
  Zap,
  Play,
  Settings,
  Sparkles
} from 'lucide-react';

export default function LiveContentView() {
  const { screens, addToast } = useScreenFlow();

  const [tickerText, setTickerText] = useState('🚨 BREAKING NEWS: Annual Tech Summit 2026 Opening Keynote Begins at 10:00 AM in Main Hall A • Special Discount Codes Available at Booth #402');
  const [tickerBg, setTickerBg] = useState('bg-blue-600');
  const [isTickerActive, setIsTickerActive] = useState(false);

  const [emergencyText, setEmergencyText] = useState('FIRE ALARM OVERRIDE: PLEASE EVACUATE VIA NORTH EMERGENCY EXITS IMMEDIATELY.');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const handlePushTicker = () => {
    setIsTickerActive(!isTickerActive);
    addToast(
      isTickerActive ? 'info' : 'success',
      'Live Ticker Updated',
      isTickerActive ? 'Ticker text stopped.' : 'Pushed scrolling live ticker to all connected LED screens.'
    );
  };

  const handlePushEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
    addToast(
      isEmergencyActive ? 'info' : 'error',
      'Emergency Alert Override',
      isEmergencyActive ? 'Emergency alert cleared.' : 'EMERGENCY ALERT BROADCAST LIVE ON ALL LED SCREENS.'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Live Stream & Announcement Mode
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              MVP Integration
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Broadcast live news tickers, emergency text overlays, and IP camera RTSP video streams.
          </p>
        </div>
      </div>

      {/* Integration Notice Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900 border border-blue-500/30 flex items-start gap-3.5 shadow-xl">
        <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            Hardware Streaming Integration Interface
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] uppercase font-mono">
              Coming Soon / Demo Preview
            </span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Live Mode allows real-time camera feeds (RTSP/RTMP), sports tickers, and emergency overrides to stream directly onto physical LED display controllers without interrupting scheduled ad loops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Live Ticker Text Builder */}
        <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Megaphone className="w-4 h-4 text-cyan-400" />
              <span>Live Scrolling Text Ticker</span>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isTickerActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isTickerActive ? '● Broadcasting Live' : 'Inactive'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Ticker Message Text</label>
              <textarea
                rows="3"
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Live Ticker Visual Preview */}
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Live Display Overlay Preview:</span>
              <div className={`p-2 rounded-xl text-white text-xs font-bold font-mono overflow-hidden relative border border-white/20 ${tickerBg}`}>
                <div className="whitespace-nowrap animate-marquee">
                  {tickerText}
                </div>
              </div>
            </div>

            <button
              onClick={handlePushTicker}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                isTickerActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{isTickerActive ? 'Stop Live Ticker Broadcast' : 'Push Live Ticker to All Screens'}</span>
            </button>
          </div>
        </div>

        {/* Module 2: Emergency Alert Broadcast Pusher */}
        <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Safety Override</span>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isEmergencyActive
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isEmergencyActive ? '🚨 EMERGENCY ACTIVE' : 'Standby'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Emergency Notice Text</label>
              <textarea
                rows="3"
                value={emergencyText}
                onChange={(e) => setEmergencyText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              onClick={handlePushEmergency}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                isEmergencyActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isEmergencyActive ? 'Clear Emergency Override' : 'TRIGGER EMERGENCY BROADCAST'}</span>
            </button>
          </div>
        </div>

        {/* Module 3: Live Camera Stream RTSP/RTMP Mockup */}
        <div className="lg:col-span-2 bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Video className="w-4 h-4 text-purple-400" />
              <span>IP Camera / RTSP Video Stream Ingestion</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono">
              rtsp://camera-01.local:554/live
            </span>
          </div>

          {/* Camera Feed Mockup Canvas */}
          <div className="relative aspect-video max-h-80 bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Live Camera Feed"
              className="w-full h-full object-cover opacity-60"
            />

            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
              ● LIVE CAM 01
            </div>

            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-1 rounded backdrop-blur-md">
              1080p 60fps • H.264 HLS Stream
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
