import React, { useState } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import ScreenMockupCanvas from '../common/ScreenMockupCanvas';
import {
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Square,
  Sun,
  Volume2,
  VolumeX,
  Zap,
  RefreshCw,
  Tv,
  ListVideo,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Radio
} from 'lucide-react';

export default function RemoteControlView() {
  const {
    screens,
    selectedScreenId,
    setSelectedScreenId,
    selectedScreen,
    playlists,
    mediaList,
    commandLogs,
    currentUser,
    handleRemotePlayback,
    setScreenBrightness,
    setScreenAudio,
    instantBroadcastMedia,
    clearInstantBroadcast,
    switchScreenPlaylist,
    rebootScreenPlayer,
    setIsPairingModalOpen
  } = useScreenFlow();

  const [instantMediaId, setInstantMediaId] = useState('');
  const [targetPlaylistId, setTargetPlaylistId] = useState('');

  if (!selectedScreen) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 pb-16 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161c27] p-4 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Remote Control Console
              </h2>
              <p className="text-xs text-slate-400">
                One-handed touch control for connected hardware media player nodes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Tv className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Connected Displays</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Remote commands (play, pause, volume, brightness, reboot, emergency broadcast) require a target display node. Pair a player or add a screen to start controlling hardware.
            </p>
          </div>
          {currentUser.role !== 'viewer' && (
            <button
              onClick={() => setIsPairingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <Tv className="w-4 h-4" />
              <span>Pair Screen Player</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 md:pb-0">
      {/* Top Header & Screen Target Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161c27] p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Remote Control Console
            </h2>
            <p className="text-xs text-slate-400">
              One-handed touch control for connected hardware media player nodes.
            </p>
          </div>
        </div>

        {/* Screen Picker Carousel Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase hidden sm:inline">Active Screen:</span>
          <select
            value={selectedScreenId}
            onChange={(e) => setSelectedScreenId(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-sm font-bold text-blue-400 rounded-2xl px-4 py-2 focus:outline-none focus:border-blue-500 shadow-inner"
          >
            {screens.map((scr) => (
              <option key={scr.id} value={scr.id}>
                {scr.name} [{scr.deviceId}]
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Big Touch Control Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Transport Control Buttons */}
          <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Playback Transport
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedScreen.playbackState === 'playing'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                ● State: {selectedScreen.playbackState}
              </span>
            </div>

            {/* Big One-Handed Touch Control Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleRemotePlayback(selectedScreen.id, 'PLAY')}
                className="py-4 px-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>Play</span>
              </button>

              <button
                onClick={() => handleRemotePlayback(selectedScreen.id, 'PAUSE')}
                className="py-4 px-3 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-sm flex flex-col items-center justify-center gap-2 shadow-lg shadow-amber-600/20 active:scale-95 transition-all"
              >
                <Pause className="w-6 h-6 fill-current" />
                <span>Pause</span>
              </button>

              <button
                onClick={() => handleRemotePlayback(selectedScreen.id, 'RESTART')}
                className="py-4 px-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
                <span>Restart</span>
              </button>

              <button
                onClick={() => handleRemotePlayback(selectedScreen.id, 'STOP')}
                className="py-4 px-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 font-bold text-sm flex flex-col items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
              >
                <Square className="w-6 h-6 fill-current text-slate-400" />
                <span>Stop</span>
              </button>
            </div>
          </div>

          {/* Hardware Sliders & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brightness Slider */}
            <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>LED Brightness Register</span>
                </div>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {selectedScreen.brightness || 80}%
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                value={selectedScreen.brightness || 80}
                onChange={(e) => setScreenBrightness(selectedScreen.id, Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% Low Power</span>
                <span>50%</span>
                <span>100% Full Nits</span>
              </div>
            </div>

            {/* Mute & Volume Control */}
            <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  {selectedScreen.isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-blue-400" />
                  )}
                  <span>Audio Volume</span>
                </div>

                <button
                  onClick={() =>
                    setScreenAudio(
                      selectedScreen.id,
                      selectedScreen.volume || 30,
                      !selectedScreen.isMuted
                    )
                  }
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    selectedScreen.isMuted
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {selectedScreen.isMuted ? 'Muted' : 'Unmuted'}
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                disabled={selectedScreen.isMuted}
                value={selectedScreen.volume || 0}
                onChange={(e) =>
                  setScreenAudio(selectedScreen.id, Number(e.target.value), false)
                }
                className="w-full accent-blue-500 bg-slate-900 h-2 rounded-lg cursor-pointer disabled:opacity-30"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0%</span>
                <span>Volume: {selectedScreen.volume || 0}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Instant Priority Broadcast & Playlist Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Immediate Playlist Switcher */}
            <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <ListVideo className="w-4 h-4" />
                <span>Immediate Playlist Switch</span>
              </div>

              <select
                value={targetPlaylistId}
                onChange={(e) => setTargetPlaylistId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="">Select Playlist...</option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  if (targetPlaylistId) switchScreenPlaylist(selectedScreen.id, targetPlaylistId);
                }}
                disabled={!targetPlaylistId}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition-all"
              >
                Push Playlist Bundle Now
              </button>
            </div>

            {/* Instant Broadcast Priority Override */}
            <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <Zap className="w-4 h-4" />
                <span>Instant Image/Video Broadcast</span>
              </div>

              <select
                value={instantMediaId}
                onChange={(e) => setInstantMediaId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="">Select Media Asset...</option>
                {mediaList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.type})
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (instantMediaId) instantBroadcastMedia(selectedScreen.id, instantMediaId);
                  }}
                  disabled={!instantMediaId}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-all"
                >
                  Broadcast Asset
                </button>

                {selectedScreen.instantMediaId && (
                  <button
                    onClick={() => clearInstantBroadcast(selectedScreen.id)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hard Reboot Watchdog Trigger */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Hard Player Reboot Signal</h4>
                <p className="text-[11px] text-slate-400">
                  Sends system watchdog reset pulse to player ID <span className="font-mono text-amber-300">{selectedScreen.deviceId}</span>.
                </p>
              </div>
            </div>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => rebootScreenPlayer(selectedScreen.id)}
                className="px-3.5 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold transition-colors"
              >
                Reboot Node
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Screen Feedback & Command Audit Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ScreenMockupCanvas screen={selectedScreen} />

          {/* Real-Time Command Log Table */}
          <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Command Delivery Log
              </span>
              <span className="text-[10px] font-mono text-slate-400">WebSocket / API Gateway</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {commandLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400">{log.action}</span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Delivered ({log.latency})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">{log.details}</p>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()} • {log.deviceId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
