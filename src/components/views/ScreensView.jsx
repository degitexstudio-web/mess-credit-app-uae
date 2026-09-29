import React, { useState } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import {
  Tv,
  Plus,
  Wifi,
  Sliders,
  Edit,
  Trash2,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  X,
  Layers,
  Info
} from 'lucide-react';

export default function ScreensView() {
  const {
    screens,
    playlists,
    currentUser,
    setSelectedScreenId,
    setActiveTab,
    addScreen,
    updateScreen,
    deleteScreen,
    rebootScreenPlayer,
    setIsPairingModalOpen,
    setConfirmModal
  } = useScreenFlow();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedScreenDetail, setSelectedScreenDetail] = useState(null);

  // Edit / Add Screen Modal state
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    resolution: '1920x1080',
    orientation: 'landscape',
    aspectRatio: '16:9',
    connectionMethod: 'Ethernet'
  });

  const handleOpenAdd = () => {
    setEditingScreen(null);
    setFormData({
      name: '',
      location: '',
      resolution: '1920x1080',
      orientation: 'landscape',
      aspectRatio: '16:9',
      connectionMethod: 'Ethernet'
    });
    setIsScreenModalOpen(true);
  };

  const handleOpenEdit = (scr) => {
    setEditingScreen(scr);
    setFormData({
      name: scr.name,
      location: scr.location,
      resolution: scr.resolution,
      orientation: scr.orientation,
      aspectRatio: scr.aspectRatio || '16:9',
      connectionMethod: scr.connectionMethod
    });
    setIsScreenModalOpen(true);
  };

  const handleSaveScreen = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingScreen) {
      updateScreen(editingScreen.id, formData);
    } else {
      addScreen(formData);
    }
    setIsScreenModalOpen(false);
  };

  const handleDeleteConfirm = (scr) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete LED Display "${scr.name}"?`,
      message: `Are you sure you want to remove ${scr.name} (${scr.deviceId})? The physical player will be unlinked from ScreenFlow.`,
      onConfirm: () => deleteScreen(scr.id)
    });
  };

  // Filter logic
  const filteredScreens = screens.filter((scr) => {
    const matchesSearch =
      scr.name.toLowerCase().includes(search.toLowerCase()) ||
      scr.location.toLowerCase().includes(search.toLowerCase()) ||
      scr.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scr.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Screen & Device Management
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {screens.length} Connected Nodes
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure resolution, orientation, pairing credentials, and dedicated player hardware telemetry.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPairingModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold text-xs border border-blue-500/30 flex items-center gap-1.5 transition-all"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Pair Code</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Screen</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161c27] p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, location, or player ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'online', 'syncing', 'offline'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Screen Cards Grid */}
      {filteredScreens.length === 0 ? (
        <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
            <Tv className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Connected Displays</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {search || filterStatus !== 'all'
                ? 'No screens match your search or filter criteria. Try adjusting your search term.'
                : 'Connect your dedicated physical hardware media players (e.g. Raspberry Pi, NovaStar, BrightSign, or Android Signage boxes) or create a new display node.'}
            </p>
          </div>
          {(!search && filterStatus === 'all' && currentUser.role === 'admin') && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsPairingModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold border border-blue-500/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Wifi className="w-4 h-4" />
                <span>Pair 6-Digit Code</span>
              </button>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Screen Node</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScreens.map((scr) => {
          const activePl = playlists.find((p) => p.id === scr.currentPlaylistId);

          return (
            <div
              key={scr.id}
              className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                        {scr.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{scr.location}</p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      scr.status === 'online'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : scr.status === 'syncing'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    ● {scr.status}
                  </span>
                </div>

                {/* Hardware Spec Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] font-mono text-blue-300 border border-slate-700">
                    {scr.resolution}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 uppercase border border-slate-700">
                    {scr.orientation}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] font-mono text-amber-300 border border-slate-700">
                    ID: {scr.deviceId}
                  </span>
                </div>

                {/* Playlist & Content status */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Assigned Playlist:</span>
                    <span className="text-blue-400 font-semibold truncate max-w-[150px]">
                      {activePl?.name || 'No Playlist'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Pairing Code:</span>
                    <span className="font-mono text-emerald-400 font-bold">{scr.pairingCode}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Connection:</span>
                    <span className="text-slate-400">{scr.connectionMethod}</span>
                  </div>
                </div>

                {/* Player Hardware Quick Telemetry */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block">CPU</span>
                    <span className="font-mono font-bold text-slate-200">{scr.cpuUsage}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Temp</span>
                    <span className="font-mono font-bold text-emerald-400">{scr.temperature}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Free Storage</span>
                    <span className="font-mono font-bold text-slate-200">{scr.storageFree}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedScreenDetail(scr)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>Telemetry</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedScreenId(scr.id);
                      setActiveTab('remote');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Control</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(scr)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Edit Screen Configuration"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(scr)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove Screen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Screen Detail Telemetry Drawer Modal */}
      {selectedScreenDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedScreenDetail.name}</h3>
                  <p className="text-xs text-slate-400">Player Node: {selectedScreenDetail.deviceId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScreenDetail(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">IP Address</span>
                <span className="font-mono text-sm text-slate-100">{selectedScreenDetail.ipAddress}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">System Uptime</span>
                <span className="font-mono text-sm text-emerald-400">{selectedScreenDetail.uptime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Signal Strength</span>
                <span className="font-mono text-sm text-blue-400">{selectedScreenDetail.signalStrength}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">RAM Usage</span>
                <span className="font-mono text-sm text-slate-100">{selectedScreenDetail.ramUsage}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  rebootScreenPlayer(selectedScreenDetail.id);
                  setSelectedScreenDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-semibold text-xs border border-amber-500/40 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reboot Player Node</span>
              </button>

              <button
                onClick={() => setSelectedScreenDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Screen Modal */}
      {isScreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSaveScreen}
            className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingScreen ? 'Edit Display Specs' : 'Add New LED Screen'}
              </h3>
              <button
                type="button"
                onClick={() => setIsScreenModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Screen Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Times Square North Billboard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Location Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building A, Main Entrance"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Resolution</label>
                  <select
                    value={formData.resolution}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="3840x2160">3840x2160 (4K UHD)</option>
                    <option value="1920x1080">1920x1080 (Full HD)</option>
                    <option value="1080x1920">1080x1920 (Portrait HD)</option>
                    <option value="5120x1440">5120x1440 (32:9 Ultra-Wide)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Orientation</label>
                  <select
                    value={formData.orientation}
                    onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="landscape">Landscape (Horizontal)</option>
                    <option value="portrait">Portrait (Vertical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Connection Method</label>
                <select
                  value={formData.connectionMethod}
                  onChange={(e) => setFormData({ ...formData, connectionMethod: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Ethernet">PoE Gigabit Ethernet</option>
                  <option value="Fiber Gigabit">Direct Fiber Gigabit</option>
                  <option value="5G Cellular Modem">5G Industrial Cellular</option>
                  <option value="Wi-Fi 6">Wi-Fi 6 Mesh Network</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsScreenModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
              >
                {editingScreen ? 'Save Changes' : 'Create Screen'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
