import React, { useState, useRef } from 'react';
import { useScreenFlow } from '../../context/ScreenFlowContext';
import {
  Image,
  Video,
  Upload,
  Search,
  Tag,
  Trash2,
  Edit2,
  Play,
  Clock,
  HardDrive,
  Filter,
  X,
  Plus,
  Maximize2,
  FileCheck,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';

export default function MediaLibraryView() {
  const {
    mediaList,
    uploadMedia,
    deleteMedia,
    currentUser,
    setConfirmModal,
    addToast
  } = useScreenFlow();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video'
  const [selectedTag, setSelectedTag] = useState('all');

  // Modals & Upload state
  const fileInputRef = useRef(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSource, setUploadSource] = useState('file'); // 'file' | 'url'
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'video',
    url: '',
    thumbnail: '',
    duration: 15,
    size: '12.4 MB',
    resolution: '1920x1080',
    tags: '#Promo'
  });

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    const mediaType = isVideo ? 'video' : 'image';
    const objectUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    setUploadForm((prev) => ({
      ...prev,
      title: prev.title || cleanTitle,
      type: mediaType,
      url: objectUrl,
      thumbnail: isImage ? objectUrl : '',
      size: sizeMb,
      resolution: isVideo ? '1920x1080' : '1920x1080'
    }));

    if (isVideo) {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = objectUrl;
      tempVideo.onloadedmetadata = () => {
        const dur = Math.round(tempVideo.duration) || 15;
        const res = tempVideo.videoWidth && tempVideo.videoHeight
          ? `${tempVideo.videoWidth}x${tempVideo.videoHeight}`
          : '1920x1080';
        setUploadForm((prev) => ({ ...prev, duration: dur, resolution: res }));
      };
    } else if (isImage) {
      const tempImg = new window.Image();
      tempImg.src = objectUrl;
      tempImg.onload = () => {
        const res = tempImg.naturalWidth && tempImg.naturalHeight
          ? `${tempImg.naturalWidth}x${tempImg.naturalHeight}`
          : '1920x1080';
        setUploadForm((prev) => ({ ...prev, resolution: res }));
      };
    }
  };

  // Collect unique tags
  const allTags = Array.from(
    new Set(mediaList.flatMap((m) => m.tags || []))
  );

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) return;

    if (!uploadForm.url.trim()) {
      addToast('error', 'Missing Media', 'Please select a local file or provide a media URL.');
      return;
    }

    const finalUrl = uploadForm.url.trim();
    const finalThumb = uploadForm.thumbnail.trim() || finalUrl;

    const tagArray = uploadForm.tags
      .split(',')
      .map((t) => (t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`))
      .filter((t) => t.length > 1);

    uploadMedia({
      title: uploadForm.title.trim(),
      type: uploadForm.type,
      url: finalUrl,
      thumbnail: finalThumb,
      duration: Number(uploadForm.duration) || 10,
      size: uploadForm.size || '5.0 MB',
      resolution: uploadForm.resolution || '1920x1080',
      tags: tagArray.length > 0 ? tagArray : ['#General']
    });

    setIsUploadOpen(false);
    setSelectedFileName('');
    setUploadForm({
      title: '',
      type: 'video',
      url: '',
      thumbnail: '',
      duration: 15,
      size: '12.4 MB',
      resolution: '1920x1080',
      tags: '#Promo'
    });
  };

  const handleDeleteConfirm = (media) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Media "${media.title}"?`,
      message: `Are you sure you want to permanently remove this asset? It will also be unlinked from any active playlists.`,
      onConfirm: () => deleteMedia(media.id)
    });
  };

  // Filtered Media List
  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === 'all' || m.type === filterType;
    const matchesTag = selectedTag === 'all' || m.tags.includes(selectedTag);
    return matchesSearch && matchesType && matchesTag;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Media Library & Assets
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {mediaList.length} Items
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Upload high-resolution videos and promotional photos for LED display playback.
          </p>
        </div>

        {currentUser.role !== 'viewer' && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#161c27] p-3.5 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or hashtag tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Filter Type Tabs & Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filters */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['all', 'video', 'image'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'video' ? 'Videos' : type === 'image' ? 'Photos' : 'All Types'}
              </button>
            ))}
          </div>

          {/* Tag Selector */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-[#161c27] border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
            <Image className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Media Library is Empty</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {search || filterType !== 'all' || selectedTag !== 'all'
                ? 'No media assets match your active filter criteria.'
                : 'Upload MP4/WEBM video files or JPG/PNG image banners from your computer to build playback sequences for your LED displays.'}
            </p>
          </div>
          {(!search && filterType === 'all' && selectedTag === 'all' && currentUser.role !== 'viewer') && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 cursor-pointer transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload First Asset</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="bg-[#161c27] border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              {/* Thumbnail Preview Area */}
              <div className="relative aspect-video bg-black overflow-hidden group">
                <img
                  src={media.thumbnail || media.url}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />

                {/* Type Badge */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
                  {media.type === 'video' ? (
                    <Video className="w-3 h-3 text-purple-400" />
                  ) : (
                    <Image className="w-3 h-3 text-cyan-400" />
                  )}
                  <span className="uppercase">{media.type}</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-slate-200 backdrop-blur-md">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>{media.duration}s</span>
                </div>

                {/* Hover Fullscreen Preview Play Button */}
                <button
                  onClick={() => setPreviewMedia(media)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-blue-600/90 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </button>
              </div>

              {/* Media Metadata */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {media.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span className="font-mono text-blue-300">{media.resolution}</span>
                    <span>•</span>
                    <span>{media.size}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {media.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] font-semibold text-slate-400 border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-[10px] text-slate-500">By {media.uploader}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewMedia(media)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="Preview Media"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    {currentUser.role !== 'viewer' && (
                      <button
                        onClick={() => handleDeleteConfirm(media)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{previewMedia.title}</h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">
                  {previewMedia.resolution}
                </span>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Canvas */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {previewMedia.type === 'video' ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>Duration: <strong className="text-white font-mono">{previewMedia.duration}s</strong></span>
                <span>File Size: <strong className="text-white">{previewMedia.size}</strong></span>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-[#161c27] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Upload Media Asset</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Source Mode Selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setUploadSource('file')}
                className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadSource === 'file'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Local File</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadSource('url')}
                className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadSource === 'url'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Web / CDN Link</span>
              </button>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/webm,image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploadSource === 'file' ? (
              /* Drag & Drop / Click Target Area */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-900/60 transition-colors cursor-pointer group"
              >
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-semibold text-slate-200">
                  {selectedFileName ? (
                    <span className="text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Selected: {selectedFileName}
                    </span>
                  ) : (
                    'Click to browse or drop MP4/WEBM video or JPG/PNG image'
                  )}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Supports MP4, WEBM, JPG, PNG up to 4K resolution
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-slate-400 font-medium mb-1">Direct Media URL</label>
                <input
                  type="url"
                  placeholder="https://your-cdn.com/stream/ad_loop.mp4"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Promotional Video"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Media Type</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="video">Video (MP4, WEBM)</option>
                    <option value="image">Image (JPG, PNG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={uploadForm.duration}
                    onChange={(e) => setUploadForm({ ...uploadForm, duration: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="#Promo, #Retail, #Event"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Add Asset to Library
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
