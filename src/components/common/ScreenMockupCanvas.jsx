import React, { useState, useRef, useEffect } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import {
  Pause,
  Volume2,
  VolumeX,
  Sun,
  Grid,
  RefreshCw,
  Tv,
  Sparkles,
  Sliders,
  Zap
} from 'lucide-react';

export default function ScreenMockupCanvas({ screen }) {
  const {
    mediaList,
    playlists,
    setScreenAudio,
    clearInstantBroadcast,
    setActiveTab,
    setSelectedScreenId,
    setIsPairingModalOpen
  } = useScreenFlow();

  const [showLedGrid, setShowLedGrid] = useState(false);
  const videoRef = useRef(null);

  // Active Media Item (Instant broadcast override priority > current media > fallback)
  const activeMediaId = screen ? (screen.instantMediaId || screen.currentMediaId) : null;
  const currentMedia = mediaList.find((m) => m.id === activeMediaId) || null;

  // Sync Video Element with Playback State & Mute Settings (Unconditional hook)
  useEffect(() => {
    if (!screen) return;
    if (videoRef.current && currentMedia?.type === 'video') {
      if (screen.playbackState === 'playing') {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      videoRef.current.muted = screen.isMuted;
    }
  }, [screen?.playbackState, screen?.isMuted, currentMedia, screen]);

  if (!screen) {
    return (
      <div className="bg-[#121824] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
          <Tv className="w-8 h-8" />
        </div>
        <div className="max-w-sm mx-auto">
          <h3 className="text-base font-bold text-white">No Connected Displays</h3>
          <p className="text-xs text-slate-400 mt-1">
            Pair your first physical LED screen or digital signage player node using its 6-digit hardware pairing code.
          </p>
        </div>
        <button
          onClick={() => setIsPairingModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Pair Display with Code</span>
        </button>
      </div>
    );
  }

  const activePlaylist = playlists.find((p) => p.id === screen.currentPlaylistId);

  // Dynamic Aspect Ratio Styling
  let aspectRatioClass = 'aspect-video'; // 16:9
  if (screen.orientation === 'portrait' || screen.aspectRatio === '9:16') {
    aspectRatioClass = 'aspect-[9/16] max-w-[320px] mx-auto';
  } else if (screen.aspectRatio === '32:9') {
    aspectRatioClass = 'aspect-[32/9]';
  }

  // Brightness Opacity Filter (0.1 to 1.0)
  const brightnessOpacity = (screen.brightness || 80) / 100;

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
      {/* Top Header Controls Bar for Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">{screen.name}</h3>
              <span
                className={`w-2 h-2 rounded-full ${
                  screen.status === 'online'
                    ? 'bg-emerald-500 animate-pulse'
                    : screen.status === 'syncing'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{screen.location}</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-blue-400">{screen.resolution}</span>
            </p>
          </div>
        </div>

        {/* Live Controls Bar */}
        <div className="flex items-center gap-2">
          {/* LED Grid Toggle */}
          <button
            onClick={() => setShowLedGrid(!showLedGrid)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              showLedGrid
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Physical LED Pixel Grid Simulation"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LED Grid</span>
          </button>

          {/* Quick Mute Toggle */}
          <button
            onClick={() => setScreenAudio(screen.id, screen.volume || 30, !screen.isMuted)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              screen.isMuted
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
            }`}
            title={screen.isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {screen.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Full Remote Button */}
          <button
            onClick={() => {
              setSelectedScreenId(screen.id);
              setActiveTab('remote');
            }}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Control Screen</span>
          </button>
        </div>
      </div>

      {/* Virtual Physical LED Cabinet Display Container */}
      <div className="relative w-full bg-black rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl ring-1 ring-white/10">
        {/* Screen Content Wrapper with Aspect Ratio */}
        <div className={`w-full ${aspectRatioClass} relative flex items-center justify-center bg-black overflow-hidden`}>
          {/* Rebooting Overlay Sequence */}
          {screen.playbackState === 'rebooting' ? (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 z-30 text-center animate-in fade-in">
              <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <div className="text-sm font-bold text-white tracking-wide">REBOOTING MEDIA PLAYER</div>
              <div className="text-xs text-slate-400 font-mono mt-1">{screen.deviceId} (Linux OS v5.14)</div>
              <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-full animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-500 mt-2">Checking LED driver matrices & firmware...</div>
            </div>
          ) : screen.status === 'offline' ? (
            /* Offline Screen Display */
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 z-20 text-center">
              <Tv className="w-12 h-12 text-slate-700 mb-2" />
              <div className="text-sm font-bold text-rose-400 tracking-wider">NO HARDWARE SIGNAL</div>
              <div className="text-xs text-slate-500 mt-1">Player offline or power disconnected</div>
              <div className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-mono mt-3">
                LAST SEEN: {screen.lastSeen}
              </div>
            </div>
          ) : !currentMedia ? (
            /* Standby Test Pattern Display */
            <div className="w-full h-full relative bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
                  <Tv className="w-7 h-7" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
              </div>
              
              <div className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 uppercase">
                ScreenFlow Standby
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Node ID: <span className="text-emerald-400">{screen.deviceId}</span> • {screen.resolution}
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs mt-2">
                Display node connected and active. Awaiting media playlist assignment or live broadcast override.
              </p>

              <button
                onClick={() => setActiveTab('playlists')}
                className="mt-4 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Assign Playlist →</span>
              </button>
            </div>
          ) : (
            /* Live Media Display (Video or Image) */
            <div className="w-full h-full relative" style={{ opacity: brightnessOpacity }}>
              {currentMedia.type === 'video' ? (
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  poster={currentMedia.thumbnail}
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentMedia.url || currentMedia.thumbnail}
                  alt={currentMedia.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Physical LED Pixel Matrix Overlay Simulation */}
              {showLedGrid && (
                <div
                  className="absolute inset-0 pointer-events-none z-10 opacity-45"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(0,0,0,0.8) 1.5px, transparent 1.5px)',
                    backgroundSize: '6px 6px'
                  }}
                />
              )}

              {/* Instant Broadcast Priority Banner */}
              {screen.instantMediaId && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-lg border border-rose-400/40 animate-pulse">
                  <Zap className="w-3 h-3" />
                  <span>Instant Broadcast Override</span>
                  <button
                    onClick={() => clearInstantBroadcast(screen.id)}
                    className="ml-1 underline hover:text-rose-200"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Playback Paused Overlay */}
              {screen.playbackState === 'paused' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
                  <div className="p-3 rounded-full bg-blue-600/80 text-white shadow-xl">
                    <Pause className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* On-Screen Hardware Status Pill Overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl text-[11px] text-white font-medium shadow-lg">
              <span className="text-blue-400 font-bold">{currentMedia?.title || 'No Media'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">{activePlaylist?.name || 'Manual Play'}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl text-[10px] text-slate-300 font-mono shadow-lg">
              <span className="flex items-center gap-1 text-amber-400">
                <Sun className="w-3 h-3" /> {screen.brightness || 80}%
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{screen.orientation.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Bottom Quick Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">Device ID</span>
          <span className="font-mono text-slate-200 font-semibold">{screen.deviceId}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">Connection</span>
          <span className="text-slate-200">{screen.connectionMethod}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">Hardware Temp</span>
          <span className="text-emerald-400 font-semibold">{screen.temperature}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">Storage Free</span>
          <span className="text-slate-200 font-mono">{screen.storageFree}</span>
        </div>
      </div>
    </div>
  );
}
