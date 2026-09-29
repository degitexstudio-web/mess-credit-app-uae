import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  defaultAdminUser,
  initialUsers,
  initialScreens,
  initialMedia,
  initialPlaylists,
  initialSchedules,
  initialSystemLogs
} from '../services/mockData';
import { playerApiAdapter } from '../services/playerApiAdapter';

const ScreenFlowContext = createContext();

const STORAGE_KEYS = {
  SCREENS: 'screenflow_screens_v1',
  MEDIA: 'screenflow_media_v1',
  PLAYLISTS: 'screenflow_playlists_v1',
  SCHEDULES: 'screenflow_schedules_v1',
  LOGS: 'screenflow_logs_v1',
  USER: 'screenflow_user_v1',
  INIT_FLAG: 'screenflow_initialized_v1'
};

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null && raw !== undefined) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`Failed to parse ${key} from storage:`, e);
  }
  return fallback;
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to storage:`, e);
  }
}

export function ScreenFlowProvider({ children }) {
  // Auth & Current User
  const [currentUser, setCurrentUser] = useState(() =>
    loadStorage(STORAGE_KEYS.USER, defaultAdminUser || initialUsers[0])
  );
  
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhonePreview, setIsPhonePreview] = useState(false);

  // Production Persistent Entities (Clean default: empty arrays)
  const [screens, setScreens] = useState(() => loadStorage(STORAGE_KEYS.SCREENS, []));
  const [mediaList, setMediaList] = useState(() => loadStorage(STORAGE_KEYS.MEDIA, []));
  const [playlists, setPlaylists] = useState(() => loadStorage(STORAGE_KEYS.PLAYLISTS, []));
  const [schedules, setSchedules] = useState(() => loadStorage(STORAGE_KEYS.SCHEDULES, []));
  const [commandLogs, setCommandLogs] = useState(() => loadStorage(STORAGE_KEYS.LOGS, []));

  // Sync to LocalStorage
  useEffect(() => { saveStorage(STORAGE_KEYS.SCREENS, screens); }, [screens]);
  useEffect(() => { saveStorage(STORAGE_KEYS.MEDIA, mediaList); }, [mediaList]);
  useEffect(() => { saveStorage(STORAGE_KEYS.PLAYLISTS, playlists); }, [playlists]);
  useEffect(() => { saveStorage(STORAGE_KEYS.SCHEDULES, schedules); }, [schedules]);
  useEffect(() => { saveStorage(STORAGE_KEYS.LOGS, commandLogs); }, [commandLogs]);
  useEffect(() => { saveStorage(STORAGE_KEYS.USER, currentUser); }, [currentUser]);

  // UI Selections & Modals
  const [selectedScreenId, setSelectedScreenId] = useState(() => {
    const initial = loadStorage(STORAGE_KEYS.SCREENS, []);
    return initial[0]?.id || '';
  });

  // Keep selectedScreenId synchronized if screens change
  useEffect(() => {
    if (screens.length > 0 && (!selectedScreenId || !screens.some((s) => s.id === selectedScreenId))) {
      setSelectedScreenId(screens[0].id);
    } else if (screens.length === 0 && selectedScreenId) {
      setSelectedScreenId('');
    }
  }, [screens, selectedScreenId]);

  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Notifications Stack
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = (type, title, message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast = { id, type, title, message, time: new Date().toLocaleTimeString() };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role Switcher & User Editor
  const switchRole = (roleKey) => {
    const targetUser = initialUsers.find((u) => u.role === roleKey) || {
      ...currentUser,
      role: roleKey
    };
    setCurrentUser(targetUser);
    addToast('info', 'Role Switched', `Active role is now ${roleKey.toUpperCase()}`);
  };

  const updateUserProfile = (updatedUser) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
    addToast('success', 'Profile Updated', 'User profile settings saved.');
  };

  // Currently Selected Screen Object (Safely null if empty)
  const selectedScreen = screens.find((s) => s.id === selectedScreenId) || screens[0] || null;

  // Live Heartbeat & Hardware Stats Simulation
  useEffect(() => {
    if (screens.length === 0) return;

    const interval = setInterval(() => {
      setScreens((prevScreens) =>
        prevScreens.map((screen) => {
          if (screen.status === 'offline' || screen.playbackState === 'rebooting') {
            return screen;
          }
          // Dynamic telemetry fluctuation
          const randomCpu = Math.max(10, Math.min(95, (screen.cpuUsage || 20) + (Math.floor(Math.random() * 5) - 2)));
          return {
            ...screen,
            cpuUsage: randomCpu
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [screens.length]);

  // Helper function to log commands
  const recordCommandLog = (screen, action, details, status, latency) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      deviceId: screen?.deviceId || 'UNKNOWN',
      screenName: screen?.name || 'Unassigned Display',
      action,
      details,
      status,
      latency
    };
    setCommandLogs((prev) => [newLog, ...prev].slice(0, 100));
  };

  // Remote Control Handlers
  const handleRemotePlayback = async (screenId, action) => {
    const targetScreen = screens.find((s) => s.id === screenId);
    if (!targetScreen) return;

    try {
      const res = await playerApiAdapter.sendRemoteCommand(screenId, action);
      if (res.success) {
        let newState = 'playing';
        if (action === 'PAUSE') newState = 'paused';
        if (action === 'STOP') newState = 'stopped';
        if (action === 'RESTART') newState = 'playing';

        setScreens((prev) =>
          prev.map((s) => (s.id === screenId ? { ...s, playbackState: newState, lastSeen: 'Just now' } : s))
        );

        recordCommandLog(targetScreen, `REMOTE_${action}`, `Playback set to ${newState}`, 'success', res.deliveryLatency);
        addToast('success', 'Command Delivered', `[${targetScreen.name}] ${res.message} (${res.deliveryLatency})`);
      }
    } catch (_err) {
      addToast('error', 'Command Failed', `Could not deliver ${action} command to device.`);
    }
  };

  const setScreenBrightness = async (screenId, brightnessValue) => {
    const targetScreen = screens.find((s) => s.id === screenId);
    if (!targetScreen) return;

    // Instant local state update for zero lag visual preview
    setScreens((prev) =>
      prev.map((s) => (s.id === screenId ? { ...s, brightness: brightnessValue } : s))
    );

    try {
      const res = await playerApiAdapter.sendRemoteCommand(screenId, 'SET_BRIGHTNESS', { brightness: brightnessValue });
      recordCommandLog(targetScreen, 'SET_BRIGHTNESS', `Brightness set to ${brightnessValue}%`, 'success', res.deliveryLatency);
    } catch (_err) {
      addToast('error', 'Hardware Error', 'Failed to update screen brightness hardware register.');
    }
  };

  const setScreenAudio = async (screenId, volume, isMuted) => {
    const targetScreen = screens.find((s) => s.id === screenId);
    if (!targetScreen) return;

    setScreens((prev) =>
      prev.map((s) => (s.id === screenId ? { ...s, volume, isMuted } : s))
    );

    try {
      const res = await playerApiAdapter.sendRemoteCommand(screenId, 'SET_AUDIO', { volume, isMuted });
      recordCommandLog(targetScreen, 'SET_AUDIO', isMuted ? 'Muted' : `Volume ${volume}%`, 'success', res.deliveryLatency);
      addToast('info', 'Audio Updated', `Screen ${targetScreen.name} ${isMuted ? 'muted' : `volume set to ${volume}%`}`);
    } catch (_err) {
      addToast('error', 'Audio Error', 'Failed to set screen audio register.');
    }
  };

  const instantBroadcastMedia = async (screenId, mediaId) => {
    const targetScreen = screens.find((s) => s.id === screenId);
    const media = mediaList.find((m) => m.id === mediaId);
    if (!targetScreen || !media) return;

    setScreens((prev) =>
      prev.map((s) => (s.id === screenId ? { ...s, instantMediaId: mediaId, currentMediaId: mediaId, playbackState: 'playing' } : s))
    );

    try {
      const res = await playerApiAdapter.sendRemoteCommand(screenId, 'INSTANT_BROADCAST', { mediaId });
      recordCommandLog(targetScreen, 'INSTANT_BROADCAST', `Pushed single asset "${media.title}" over loop`, 'success', res.deliveryLatency);
      addToast('success', 'Instant Broadcast Live', `Screen ${targetScreen.name} is now displaying "${media.title}"`);
    } catch (_err) {
      addToast('error', 'Broadcast Failed', 'Could not push instant broadcast asset.');
    }
  };

  const clearInstantBroadcast = (screenId) => {
    setScreens((prev) =>
      prev.map((s) => (s.id === screenId ? { ...s, instantMediaId: null } : s))
    );
    addToast('info', 'Broadcast Cleared', 'Screen reverted back to assigned playlist loop.');
  };

  const switchScreenPlaylist = async (screenId, playlistId) => {
    const targetScreen = screens.find((s) => s.id === screenId);
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!targetScreen || !playlist) return;

    // Get first item of playlist
    const firstMediaId = playlist.items[0] || null;

    setScreens((prev) =>
      prev.map((s) =>
        s.id === screenId
          ? {
              ...s,
              currentPlaylistId: playlistId,
              currentMediaId: firstMediaId,
              instantMediaId: null,
              playbackState: 'playing'
            }
          : s
      )
    );

    try {
      const res = await playerApiAdapter.sendRemoteCommand(screenId, 'SWITCH_PLAYLIST', { playlistId });
      recordCommandLog(targetScreen, 'SWITCH_PLAYLIST', `Switched to playlist "${playlist.name}"`, 'success', res.deliveryLatency);
      addToast('success', 'Playlist Assigned', `Now playing "${playlist.name}" on ${targetScreen.name}`);
    } catch (_err) {
      addToast('error', 'Playlist Switch Failed', 'Failed to update device playlist cache.');
    }
  };

  const rebootScreenPlayer = async (screenId) => {
    const targetScreen = screens.find((s) => s.id === screenId);
    if (!targetScreen) return;

    // Set state to rebooting
    setScreens((prev) =>
      prev.map((s) =>
        s.id === screenId
          ? {
              ...s,
              playbackState: 'rebooting',
              status: 'syncing',
              lastSeen: 'Rebooting OS...'
            }
          : s
      )
    );

    addToast('warning', 'Device Rebooting', `Reboot signal sent to ${targetScreen.name} (${targetScreen.deviceId})`);
    recordCommandLog(targetScreen, 'PLAYER_REBOOT', 'Initiated hard hardware reboot sequence', 'warning', '35ms');

    // Simulate reboot countdown completion
    setTimeout(() => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? {
                ...s,
                playbackState: 'playing',
                status: 'online',
                lastSeen: 'Just now',
                uptime: '0h 01m'
              }
            : s
        )
      );
      addToast('success', 'Device Online', `${targetScreen.name} successfully rebooted and restored playback.`);
      recordCommandLog(targetScreen, 'REBOOT_COMPLETE', 'Hardware watchdog completed boot cycle', 'success', '8000ms');
    }, 7000);
  };

  // Screen CRUD
  const pairNewScreen = async (pairingCode, name, location) => {
    try {
      const res = await playerApiAdapter.pairDevice(pairingCode, name, location);
      setScreens((prev) => [res.screen, ...prev]);
      setSelectedScreenId(res.screen.id);
      addToast('success', 'Device Paired!', `New LED Screen "${res.screen.name}" connected with ID ${res.deviceId}`);
      setIsPairingModalOpen(false);
    } catch (err) {
      addToast('error', 'Pairing Failed', err.message || 'Check pairing code and try again.');
    }
  };

  const addScreen = (screenData) => {
    const newScreen = {
      id: `scr-${Date.now()}`,
      ...screenData,
      status: 'online',
      deviceId: `PLAYER-${Math.floor(1000 + Math.random() * 9000)}`,
      pairingCode: `SF-${Math.floor(1000 + Math.random() * 9000)}`,
      signalStrength: 95,
      brightness: 80,
      volume: 0,
      isMuted: true,
      temperature: '38°C',
      cpuUsage: 20,
      storageFree: '50.0 GB',
      uptime: '0h 05m',
      lastSeen: 'Just now',
      playbackState: 'playing'
    };
    setScreens((prev) => [newScreen, ...prev]);
    addToast('success', 'Screen Created', `Screen "${screenData.name}" added successfully.`);
  };

  const updateScreen = (screenId, updatedData) => {
    setScreens((prev) =>
      prev.map((s) => (s.id === screenId ? { ...s, ...updatedData } : s))
    );
    addToast('success', 'Screen Updated', 'Screen configuration changes saved.');
  };

  const deleteScreen = (screenId) => {
    const target = screens.find((s) => s.id === screenId);
    setScreens((prev) => prev.filter((s) => s.id !== screenId));
    if (selectedScreenId === screenId) {
      setSelectedScreenId(screens.find((s) => s.id !== screenId)?.id || '');
    }
    addToast('info', 'Screen Removed', `Screen "${target?.name || screenId}" was unlinked.`);
  };

  // Media Library CRUD
  const uploadMedia = (newMediaObj) => {
    const item = {
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      uploader: currentUser.name,
      ...newMediaObj
    };
    setMediaList((prev) => [item, ...prev]);
    addToast('success', 'Media Uploaded', `Asset "${item.title}" added to library.`);
  };

  const deleteMedia = (mediaId) => {
    const target = mediaList.find((m) => m.id === mediaId);
    setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
    // Also remove from playlists
    setPlaylists((prev) =>
      prev.map((pl) => ({
        ...pl,
        items: pl.items.filter((id) => id !== mediaId)
      }))
    );
    addToast('info', 'Media Deleted', `Asset "${target?.title || mediaId}" removed.`);
  };

  // Playlist CRUD
  const savePlaylist = (playlistData) => {
    if (playlistData.id) {
      // Edit
      setPlaylists((prev) =>
        prev.map((pl) => (pl.id === playlistData.id ? { ...pl, ...playlistData, updatedAt: new Date().toISOString() } : pl))
      );
      addToast('success', 'Playlist Saved', `Playlist "${playlistData.name}" updated.`);
    } else {
      // Create
      const newPl = {
        id: `pl-${Date.now()}`,
        createdBy: currentUser.name,
        updatedAt: new Date().toISOString(),
        ...playlistData
      };
      setPlaylists((prev) => [newPl, ...prev]);
      addToast('success', 'Playlist Created', `Playlist "${newPl.name}" added.`);
    }
    setIsPlaylistModalOpen(false);
    setEditingPlaylist(null);
  };

  const duplicatePlaylist = (playlistId) => {
    const target = playlists.find((p) => p.id === playlistId);
    if (!target) return;

    const copy = {
      ...target,
      id: `pl-${Date.now()}`,
      name: `${target.name} (Copy)`,
      assignedScreens: [],
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.name
    };

    setPlaylists((prev) => [copy, ...prev]);
    addToast('success', 'Playlist Duplicated', `Created copy of "${target.name}"`);
  };

  const deletePlaylist = (playlistId) => {
    const target = playlists.find((p) => p.id === playlistId);
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    addToast('info', 'Playlist Deleted', `Playlist "${target?.name || playlistId}" deleted.`);
  };

  const assignPlaylistToScreens = (playlistId, screenIds) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, assignedScreens: screenIds } : p))
    );

    // Update screen currentPlaylistId
    setScreens((prev) =>
      prev.map((s) => {
        if (screenIds.includes(s.id)) {
          return {
            ...s,
            currentPlaylistId: playlistId,
            currentMediaId: playlist.items[0] || null,
            instantMediaId: null
          };
        }
        return s;
      })
    );

    addToast('success', 'Screens Assigned', `Assigned "${playlist.name}" to ${screenIds.length} screens.`);
  };

  // Schedule CRUD
  const saveSchedule = (scheduleData) => {
    if (scheduleData.id) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleData.id ? { ...s, ...scheduleData } : s))
      );
      addToast('success', 'Schedule Updated', `Schedule "${scheduleData.title}" saved.`);
    } else {
      const newSch = {
        id: `sch-${Date.now()}`,
        activeStatus: 'active',
        ...scheduleData
      };
      setSchedules((prev) => [newSch, ...prev]);
      addToast('success', 'Schedule Created', `Schedule "${newSch.title}" activated.`);
    }
    setIsScheduleModalOpen(false);
    setEditingSchedule(null);
  };

  const deleteSchedule = (scheduleId) => {
    const target = schedules.find((s) => s.id === scheduleId);
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    addToast('info', 'Schedule Removed', `Schedule "${target?.title || scheduleId}" removed.`);
  };

  // Production Backup & Restore
  const exportConfiguration = () => {
    const data = {
      app: 'ScreenFlow',
      version: '2.4',
      exportedAt: new Date().toISOString(),
      screens,
      mediaList,
      playlists,
      schedules,
      commandLogs
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screenflow_config_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', 'Backup Exported', 'Configuration JSON downloaded.');
  };

  const importConfiguration = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (Array.isArray(parsed.screens)) setScreens(parsed.screens);
      if (Array.isArray(parsed.mediaList)) setMediaList(parsed.mediaList);
      if (Array.isArray(parsed.playlists)) setPlaylists(parsed.playlists);
      if (Array.isArray(parsed.schedules)) setSchedules(parsed.schedules);
      if (Array.isArray(parsed.commandLogs)) setCommandLogs(parsed.commandLogs);
      if (parsed.screens?.length > 0) {
        setSelectedScreenId(parsed.screens[0].id);
      }
      addToast('success', 'Configuration Restored', 'System data restored from backup JSON.');
      return true;
    } catch (err) {
      addToast('error', 'Import Failed', 'Invalid configuration file format.');
      return false;
    }
  };

  const resetAllData = () => {
    setScreens([]);
    setMediaList([]);
    setPlaylists([]);
    setSchedules([]);
    setCommandLogs([]);
    setSelectedScreenId('');
    localStorage.removeItem(STORAGE_KEYS.SCREENS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.PLAYLISTS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    addToast('info', 'Factory Reset', 'ScreenFlow database wiped to clean state.');
  };

  const loadSampleTemplates = () => {
    setScreens(initialScreens);
    setMediaList(initialMedia);
    setPlaylists(initialPlaylists);
    setSchedules(initialSchedules);
    setCommandLogs(initialSystemLogs);
    setSelectedScreenId(initialScreens[0]?.id || '');
    addToast('success', 'Templates Loaded', 'Loaded sample displays, media, and playlists.');
  };

  return (
    <ScreenFlowContext.Provider
      value={{
        currentUser,
        switchRole,
        updateUserProfile,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isPhonePreview,
        setIsPhonePreview,
        screens,
        mediaList,
        playlists,
        schedules,
        commandLogs,
        selectedScreenId,
        setSelectedScreenId,
        selectedScreen,
        toasts,
        addToast,
        removeToast,
        
        // Remote Commands
        handleRemotePlayback,
        setScreenBrightness,
        setScreenAudio,
        instantBroadcastMedia,
        clearInstantBroadcast,
        switchScreenPlaylist,
        rebootScreenPlayer,

        // Screen CRUD & Pairing
        isPairingModalOpen,
        setIsPairingModalOpen,
        pairNewScreen,
        addScreen,
        updateScreen,
        deleteScreen,

        // Media CRUD
        isMediaUploadModalOpen,
        setIsMediaUploadModalOpen,
        uploadMedia,
        deleteMedia,

        // Playlist CRUD
        isPlaylistModalOpen,
        setIsPlaylistModalOpen,
        editingPlaylist,
        setEditingPlaylist,
        savePlaylist,
        duplicatePlaylist,
        deletePlaylist,
        assignPlaylistToScreens,

        // Schedule CRUD
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        editingSchedule,
        setEditingSchedule,
        saveSchedule,
        deleteSchedule,

        // Production Management
        exportConfiguration,
        importConfiguration,
        resetAllData,
        loadSampleTemplates,

        // Confirm Modal
        confirmModal,
        setConfirmModal
      }}
    >
      {children}
    </ScreenFlowContext.Provider>
  );
}

export function useScreenFlow() {
  const context = useContext(ScreenFlowContext);
  if (!context) {
    throw new Error('useScreenFlow must be used within a ScreenFlowProvider');
  }
  return context;
}
