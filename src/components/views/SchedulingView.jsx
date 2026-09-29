import React, { useState } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import {
  CalendarDays,
  Clock,
  Plus,
  Tv,
  ListVideo,
  AlertCircle,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Zap,
  Calendar as CalendarIcon,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SchedulingView() {
  const {
    schedules,
    playlists,
    screens,
    currentUser,
    saveSchedule,
    deleteSchedule,
    setConfirmModal,
    addToast,
    setIsPairingModalOpen
  } = useScreenFlow();

  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'calendar'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    playlistId: playlists[0]?.id || '',
    screenIds: screens[0]?.id ? [screens[0].id] : [],
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '2026-12-31',
    startTime: '09:00',
    endTime: '17:00',
    recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    priority: 'high'
  });

  const handleOpenCreate = () => {
    if (playlists.length === 0) {
      addToast('warning', 'Playlist Needed', 'Please create at least one playlist before adding a schedule rule.');
      return;
    }
    if (screens.length === 0) {
      addToast('warning', 'Display Needed', 'Please connect or pair at least one screen before scheduling.');
      return;
    }

    setEditingScheduleId(null);
    setForm({
      title: '',
      playlistId: playlists[0].id,
      screenIds: [screens[0].id],
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2026-12-31',
      startTime: '09:00',
      endTime: '17:00',
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      priority: 'high'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch) => {
    setEditingScheduleId(sch.id);
    setForm({
      title: sch.title,
      playlistId: sch.playlistId,
      screenIds: sch.screenIds || [],
      startDate: sch.startDate,
      endDate: sch.endDate,
      startTime: sch.startTime,
      endTime: sch.endTime,
      recurringDays: sch.recurringDays || [],
      priority: sch.priority || 'high'
    });
    setIsModalOpen(true);
  };

  const handleToggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter((d) => d !== day)
        : [...prev.recurringDays, day]
    }));
  };

  const handleToggleScreen = (screenId) => {
    setForm((prev) => ({
      ...prev,
      screenIds: prev.screenIds.includes(screenId)
        ? prev.screenIds.filter((id) => id !== screenId)
        : [...prev.screenIds, screenId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.playlistId || !form.screenIds.length) return;

    saveSchedule({
      id: editingScheduleId,
      ...form
    });
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = (sch) => {
    setConfirmModal({
      isOpen: true,
      title: `Remove Schedule "${sch.title}"?`,
      message: `Are you sure you want to delete this schedule rule? Target screens will revert to standard loop.`,
      onConfirm: () => deleteSchedule(sch.id)
    });
  };

  // 24-Hour Timeline Hours Array (00:00 to 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Schedule & Time-Based Override Engine
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {schedules.length} Rules Active
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Set time windows and priority rules where specific playlists temporarily override default looping displays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              24h Timeline
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              Rules List
            </button>
          </div>

          {currentUser.role !== 'viewer' && (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* View Mode 1: 24-Hour Horizontal Gantt Timeline View */}
      {viewMode === 'timeline' ? (
        screens.length === 0 ? (
          <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Connected Displays</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Timeline forecast requires at least one registered screen node. Pair an LED player or add a screen to visualize 24-hour schedules.
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
        ) : (
          <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Screen Schedule Timeline (Today's 24-Hour Forecast)</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600" /> High Priority Override
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-slate-700" /> Standard Loop
                </span>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar pt-2">
              <div className="min-w-[800px] space-y-4">
                {/* Timeline Header Hours */}
                <div className="grid grid-cols-25 text-[10px] font-mono text-slate-500 border-b border-slate-800 pb-2">
                  <div className="col-span-4 font-sans font-bold text-slate-400">Target Display</div>
                  <div className="col-span-21 grid grid-cols-24 gap-0 text-center">
                    {hours.map((h, i) => (
                      <span key={i} className={i % 3 === 0 ? 'text-slate-300 font-bold' : ''}>
                        {i % 3 === 0 ? h.slice(0, 2) : '•'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rows for each Screen */}
                {screens.map((scr) => {
                  const screenSchedules = schedules.filter((s) => s.screenIds.includes(scr.id));

                  return (
                    <div key={scr.id} className="grid grid-cols-25 items-center gap-0 py-2 border-b border-slate-800/60 text-xs">
                      <div className="col-span-4 pr-2">
                        <div className="font-bold text-white truncate">{scr.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{scr.location}</div>
                      </div>

                      <div className="col-span-21 h-10 bg-slate-900/90 rounded-xl relative overflow-hidden border border-slate-800 flex items-center px-1">
                        {/* Base Loop Background */}
                        <div className="absolute inset-0 bg-slate-900 opacity-60" />

                        {/* Render Scheduled Blocks */}
                        {screenSchedules.map((sch) => {
                          const pl = playlists.find((p) => p.id === sch.playlistId);
                          const startHour = parseInt(sch.startTime.split(':')[0], 10);
                          const endHour = parseInt(sch.endTime.split(':')[0], 10);
                          const leftPercent = (startHour / 24) * 100;
                          const widthPercent = Math.max(8, ((endHour - startHour) / 24) * 100);

                          return (
                            <div
                              key={sch.id}
                              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                              className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-2 flex items-center justify-between text-white text-[10px] font-bold shadow-lg shadow-blue-500/20 border border-blue-400/40 z-10 group cursor-pointer"
                              title={`${sch.title}: ${sch.startTime} - ${sch.endTime}`}
                            >
                              <span className="truncate">{pl?.name || sch.title}</span>
                              <span className="font-mono text-[9px] text-blue-200 shrink-0">{sch.startTime}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      ) : (
        /* View Mode 2: Rules List Card Grid */
        schedules.length === 0 ? (
          <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Schedule Rules Configured</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Screens without schedule rules will run their default assigned playlist continuously. Create rules to trigger time-based content or priority announcements.
              </p>
            </div>
            {currentUser.role !== 'viewer' && (
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Schedule Rule</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schedules.map((sch) => {
            const playlist = playlists.find((p) => p.id === sch.playlistId);
            const targetScreenNames = sch.screenIds
              .map((id) => screens.find((s) => s.id === id)?.name)
              .filter(Boolean);

            return (
              <div
                key={sch.id}
                className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-white">{sch.title}</h3>
                      <p className="text-xs text-blue-400 font-semibold mt-0.5">
                        Playlist: {playlist?.name || 'Assigned Playlist'}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        sch.priority === 'emergency'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {sch.priority} Priority
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 font-medium">Daily Window:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {sch.startTime} — {sch.endTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 font-medium">Recurring Days:</span>
                      <span className="text-slate-200 font-semibold">
                        {sch.recurringDays?.join(', ') || 'All Days'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                        Target Displays ({targetScreenNames.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {targetScreenNames.map((name) => (
                          <span
                            key={name}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {currentUser.role !== 'viewer' && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenEdit(sch)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(sch)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )
      )}

      {/* Schedule Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSubmit}
            className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <h3 className="text-lg font-bold text-white">
                {editingScheduleId ? 'Edit Schedule Rule' : 'Create Time-Based Schedule'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 text-xs pr-1 flex-1">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Schedule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Executive Corporate Broadcast"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Playlist to Play</label>
                <select
                  value={form.playlistId}
                  onChange={(e) => setForm({ ...form, playlistId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-bold"
                >
                  {playlists.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name} ({pl.totalDuration}s loop)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Days Selector */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Recurring Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isSel = form.recurringDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          isSel
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Screen Selector */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Displays</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                  {screens.map((scr) => {
                    const isSel = form.screenIds.includes(scr.id);
                    return (
                      <div
                        key={scr.id}
                        onClick={() => handleToggleScreen(scr.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSel
                            ? 'bg-blue-900/30 border-blue-500/60 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="font-semibold">{scr.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{scr.deviceId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
              >
                Save Schedule Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
