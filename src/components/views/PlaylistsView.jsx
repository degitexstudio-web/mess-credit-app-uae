import React, { useState } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import {
  ListVideo,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Tv,
  Clock,
  ArrowUp,
  ArrowDown,
  Repeat,
  Shuffle,
  CheckCircle2,
  X,
  Play,
  Image,
  Video,
  Layers,
  Sparkles
} from 'lucide-react';

export default function PlaylistsView() {
  const {
    playlists,
    mediaList,
    screens,
    currentUser,
    savePlaylist,
    duplicatePlaylist,
    deletePlaylist,
    assignPlaylistToScreens,
    setConfirmModal
  } = useScreenFlow();

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [playlistForm, setPlaylistForm] = useState({
    name: '',
    description: '',
    loopMode: 'continuous',
    items: [],
    itemSettings: {}
  });

  const [assignModalPlaylist, setAssignModalPlaylist] = useState(null);
  const [selectedScreenIds, setSelectedScreenIds] = useState([]);

  // Open Playlist Builder (Create / Edit)
  const handleOpenCreate = () => {
    setEditingPlaylistId(null);
    const initialItems = mediaList.length > 0 ? mediaList.slice(0, Math.min(2, mediaList.length)).map((m) => m.id) : [];
    const initialSettings = {};
    initialItems.forEach((id) => {
      const media = mediaList.find((m) => m.id === id);
      initialSettings[id] = { duration: media?.duration || 10 };
    });

    setPlaylistForm({
      name: '',
      description: '',
      loopMode: 'continuous',
      items: initialItems,
      itemSettings: initialSettings
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (pl) => {
    setEditingPlaylistId(pl.id);
    setPlaylistForm({
      name: pl.name,
      description: pl.description || '',
      loopMode: pl.loopMode || 'continuous',
      items: [...pl.items],
      itemSettings: { ...pl.itemSettings }
    });
    setIsEditorOpen(true);
  };

  // Add Item to Playlist Sequence
  const handleAddItem = (mediaId) => {
    if (playlistForm.items.includes(mediaId)) return;
    const media = mediaList.find((m) => m.id === mediaId);
    setPlaylistForm((prev) => ({
      ...prev,
      items: [...prev.items, mediaId],
      itemSettings: {
        ...prev.itemSettings,
        [mediaId]: { duration: media?.duration || 10 }
      }
    }));
  };

  // Remove Item from Sequence
  const handleRemoveItem = (index) => {
    setPlaylistForm((prev) => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  // Move Item Up / Down
  const handleMoveItem = (index, direction) => {
    const newItems = [...playlistForm.items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setPlaylistForm((prev) => ({ ...prev, items: newItems }));
  };

  // Update duration for item in playlist
  const handleDurationChange = (mediaId, duration) => {
    setPlaylistForm((prev) => ({
      ...prev,
      itemSettings: {
        ...prev.itemSettings,
        [mediaId]: { duration: Number(duration) || 10 }
      }
    }));
  };

  // Save Playlist
  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!playlistForm.name.trim() || !playlistForm.items.length) return;

    // Calculate total duration sum
    const totalDuration = playlistForm.items.reduce((sum, mediaId) => {
      const duration = playlistForm.itemSettings[mediaId]?.duration || 10;
      return sum + duration;
    }, 0);

    savePlaylist({
      id: editingPlaylistId,
      name: playlistForm.name,
      description: playlistForm.description,
      loopMode: playlistForm.loopMode,
      items: playlistForm.items,
      itemSettings: playlistForm.itemSettings,
      totalDuration
    });

    setIsEditorOpen(false);
  };

  // Open Assign to Screens Modal
  const handleOpenAssign = (pl) => {
    setAssignModalPlaylist(pl);
    setSelectedScreenIds(pl.assignedScreens || []);
  };

  const handleToggleScreenSelection = (screenId) => {
    setSelectedScreenIds((prev) =>
      prev.includes(screenId) ? prev.filter((id) => id !== screenId) : [...prev, screenId]
    );
  };

  const handleConfirmAssign = () => {
    if (!assignModalPlaylist) return;
    assignPlaylistToScreens(assignModalPlaylist.id, selectedScreenIds);
    setAssignModalPlaylist(null);
  };

  const handleDeleteConfirm = (pl) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Playlist "${pl.name}"?`,
      message: `Are you sure you want to delete this playlist? Screens currently playing this sequence will revert to manual loop.`,
      onConfirm: () => deletePlaylist(pl.id)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Playlist Orchestration
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {playlists.length} Sequences
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Construct media playback loops, set image display durations, and assign to single or multiple LED displays.
          </p>
        </div>

        {currentUser.role !== 'viewer' && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        )}
      </div>

      {/* Playlists Cards Grid */}
      {playlists.length === 0 ? (
        <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
            <ListVideo className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Playlists Created</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Build sequential loops of video advertisements, promotional banners, and informative graphics with custom per-item durations.
            </p>
          </div>
          {currentUser.role !== 'viewer' && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Playlist</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlists.map((pl) => {
          const playlistMediaItems = pl.items
            .map((id) => mediaList.find((m) => m.id === id))
            .filter(Boolean);

          const assignedScreenCount = pl.assignedScreens?.length || 0;

          return (
            <div
              key={pl.id}
              className="bg-[#161c27] border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Title & Loop Mode */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                      {pl.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{pl.description}</p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1 shrink-0">
                    <Repeat className="w-3 h-3" /> {pl.loopMode}
                  </span>
                </div>

                {/* Duration & Screens Count */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 pt-1">
                  <span className="flex items-center gap-1 text-slate-200 font-mono">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {pl.totalDuration}s loop
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-purple-400 font-medium">
                    <Tv className="w-3.5 h-3.5" />
                    {assignedScreenCount} Screens Assigned
                  </span>
                </div>

                {/* Items Preview Strip */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Sequence Preview ({playlistMediaItems.length} items)
                  </span>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar pr-1">
                    {playlistMediaItems.map((media, idx) => {
                      const itemDuration = pl.itemSettings?.[media.id]?.duration || media.duration;
                      return (
                        <div
                          key={`${media.id}-${idx}`}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-4 h-4 rounded bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <img
                              src={media.thumbnail}
                              alt={media.title}
                              className="w-6 h-6 rounded object-cover shrink-0"
                            />
                            <span className="text-slate-200 font-medium truncate">{media.title}</span>
                          </div>
                          <span className="font-mono text-[10px] text-blue-400 shrink-0">
                            {itemDuration}s
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleOpenAssign(pl)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Assign Screens</span>
                </button>

                {currentUser.role !== 'viewer' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => duplicatePlaylist(pl.id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Duplicate Playlist"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(pl)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Edit Sequence"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(pl)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Playlist Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSaveSubmit}
            className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <h3 className="text-lg font-bold text-white">
                {editingPlaylistId ? 'Edit Playlist Sequence' : 'Create New Playlist'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs flex-1">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Playlist Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prime Time Commercial Loop"
                  value={playlistForm.name}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief description of playlist intent..."
                  value={playlistForm.description}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Sequence Builder */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Sequence Items & Order ({playlistForm.items.length})
                </label>

                <div className="space-y-2 mb-3">
                  {playlistForm.items.map((mediaId, idx) => {
                    const media = mediaList.find((m) => m.id === mediaId);
                    if (!media) return null;
                    const duration = playlistForm.itemSettings[mediaId]?.duration || media.duration;

                    return (
                      <div
                        key={`${mediaId}-${idx}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 gap-3"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className="font-bold text-slate-500 w-4 text-center">{idx + 1}</span>
                          <img
                            src={media.thumbnail}
                            alt={media.title}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-bold text-white truncate">{media.title}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{media.type} • {media.resolution}</div>
                          </div>
                        </div>

                        {/* Duration input & Move buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                            <span className="text-[10px] text-slate-400">Sec:</span>
                            <input
                              type="number"
                              min="1"
                              max="300"
                              value={duration}
                              onChange={(e) => handleDurationChange(mediaId, e.target.value)}
                              className="w-12 bg-transparent text-white font-mono text-center outline-none font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleMoveItem(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveItem(idx, 1)}
                            disabled={idx === playlistForm.items.length - 1}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded bg-slate-800 hover:bg-rose-600/20 text-rose-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Available Media Selector */}
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
                    Click to add items from library:
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar">
                    {mediaList.map((m) => {
                      const isAdded = playlistForm.items.includes(m.id);
                      return (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => handleAddItem(m.id)}
                          disabled={isAdded}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isAdded
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                              : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{m.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30"
              >
                Save Playlist
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assign Screens Modal */}
      {assignModalPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Assign Playlist to Screens</h3>
                <p className="text-xs text-purple-400 font-semibold">{assignModalPlaylist.name}</p>
              </div>
              <button
                onClick={() => setAssignModalPlaylist(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {screens.map((scr) => {
                const isSelected = selectedScreenIds.includes(scr.id);
                return (
                  <div
                    key={scr.id}
                    onClick={() => handleToggleScreenSelection(scr.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-900/30 border-purple-500/60 ring-1 ring-purple-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{scr.name}</div>
                      <div className="text-[11px] text-slate-400">{scr.location}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setAssignModalPlaylist(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30"
              >
                Save Assignments ({selectedScreenIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
