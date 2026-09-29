// ScreenFlow Production Seed & Template Database

export const defaultAdminUser = {
  id: 'usr-admin',
  name: 'Admin Operator',
  email: 'admin@screenflow.io',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  title: 'AV Network Administrator'
};

export const initialUsers = [
  defaultAdminUser,
  {
    id: 'usr-2',
    name: 'Marcus Chen',
    email: 'content@screenflow.io',
    role: 'content_manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    title: 'Lead Content Strategist'
  },
  {
    id: 'usr-3',
    name: 'Sarah Jenkins',
    email: 'viewer@screenflow.io',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    title: 'Operations Monitor'
  }
];

export const initialMedia = [
  {
    id: 'med-1',
    title: 'Cyberpunk Neon Brand Motion',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    duration: 15,
    size: '24.5 MB',
    resolution: '3840x2160',
    uploadedAt: '2026-09-20T14:32:00Z',
    tags: ['#Promo', '#Neon', '#Brand', '#4K'],
    uploader: 'Marcus Chen'
  },
  {
    id: 'med-2',
    title: 'Luxury Watch Showcase Loop',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    duration: 30,
    size: '48.2 MB',
    resolution: '3840x2160',
    uploadedAt: '2026-09-19T09:15:00Z',
    tags: ['#Luxury', '#Retail', '#4K'],
    uploader: 'Marcus Chen'
  },
  {
    id: 'med-3',
    title: 'Corporate HQ Welcome Banner',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    duration: 10,
    size: '4.1 MB',
    resolution: '3840x2160',
    uploadedAt: '2026-09-21T11:00:00Z',
    tags: ['#Corporate', '#Welcome', '#Banner'],
    uploader: 'Alexandra Vance'
  },
  {
    id: 'med-4',
    title: 'Summer Fashion Flash Sale 50% Off',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    duration: 12,
    size: '3.8 MB',
    resolution: '1080x1920',
    uploadedAt: '2026-09-22T08:20:00Z',
    tags: ['#Retail', '#Sale', '#Fashion', '#Portrait'],
    uploader: 'Marcus Chen'
  },
  {
    id: 'med-5',
    title: 'Nature Serenity Ultra-Wide Ambient',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    duration: 60,
    size: '88.4 MB',
    resolution: '5120x1440',
    uploadedAt: '2026-09-18T16:45:00Z',
    tags: ['#Ambient', '#Nature', '#Ultrawide'],
    uploader: 'Marcus Chen'
  },
  {
    id: 'med-6',
    title: 'Airport Flight Info & Advisory',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
    duration: 15,
    size: '2.9 MB',
    resolution: '3840x2160',
    uploadedAt: '2026-09-17T13:10:00Z',
    tags: ['#Airport', '#Information', '#Safety'],
    uploader: 'Alexandra Vance'
  },
  {
    id: 'med-7',
    title: 'Electric EDM Festival Teaser',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    duration: 25,
    size: '35.1 MB',
    resolution: '3840x2160',
    uploadedAt: '2026-09-21T18:00:00Z',
    tags: ['#Event', '#Music', '#Nightlife'],
    uploader: 'Marcus Chen'
  },
  {
    id: 'med-8',
    title: 'Gourmet Bistro Evening Specials',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    duration: 8,
    size: '3.4 MB',
    resolution: '1080x1920',
    uploadedAt: '2026-09-19T20:30:00Z',
    tags: ['#Dining', '#Menu', '#Portrait'],
    uploader: 'Marcus Chen'
  }
];

export const initialPlaylists = [
  {
    id: 'pl-1',
    name: 'Prime Time Commercial Loop',
    description: 'High frequency advertisement loop for high-foot-traffic displays.',
    items: ['med-1', 'med-2', 'med-4'],
    itemSettings: {
      'med-1': { duration: 15 },
      'med-2': { duration: 30 },
      'med-4': { duration: 12 }
    },
    loopMode: 'continuous',
    totalDuration: 57,
    assignedScreens: ['scr-1', 'scr-3'],
    updatedAt: '2026-09-22T09:30:00Z',
    createdBy: 'Marcus Chen'
  },
  {
    id: 'pl-2',
    name: 'Lobby Executive & Corporate News',
    description: 'Professional welcome signage, brand motion, and corporate advisories.',
    items: ['med-3', 'med-1', 'med-6'],
    itemSettings: {
      'med-3': { duration: 10 },
      'med-1': { duration: 15 },
      'med-6': { duration: 15 }
    },
    loopMode: 'continuous',
    totalDuration: 40,
    assignedScreens: ['scr-2'],
    updatedAt: '2026-09-21T14:20:00Z',
    createdBy: 'Alexandra Vance'
  },
  {
    id: 'pl-3',
    name: 'Ultrawide Panoramic Experience',
    description: 'Ambient nature visuals tailored for ultra-wide concourse displays.',
    items: ['med-5', 'med-2'],
    itemSettings: {
      'med-5': { duration: 60 },
      'med-2': { duration: 30 }
    },
    loopMode: 'continuous',
    totalDuration: 90,
    assignedScreens: ['scr-4'],
    updatedAt: '2026-09-18T17:00:00Z',
    createdBy: 'Marcus Chen'
  },
  {
    id: 'pl-4',
    name: 'Nightlife & Event Highlights',
    description: 'High energy music teasers and restaurant menu specials.',
    items: ['med-7', 'med-8', 'med-1'],
    itemSettings: {
      'med-7': { duration: 25 },
      'med-8': { duration: 8 },
      'med-1': { duration: 15 }
    },
    loopMode: 'continuous',
    totalDuration: 48,
    assignedScreens: ['scr-6'],
    updatedAt: '2026-09-22T07:10:00Z',
    createdBy: 'Marcus Chen'
  }
];

export const initialScreens = [
  {
    id: 'scr-1',
    name: 'Times Square Billboard North',
    location: 'Times Square, 42nd St & 7th Ave',
    resolution: '3840x2160',
    aspectRatio: '16:9',
    orientation: 'landscape',
    deviceId: 'PLAYER-NY-4K01',
    pairingCode: 'SF-9012',
    status: 'online', // 'online' | 'syncing' | 'offline' | 'warning'
    connectionMethod: 'Fiber Gigabit (Direct)',
    ipAddress: '192.168.1.104',
    signalStrength: 98,
    brightness: 85,
    volume: 0,
    isMuted: true,
    temperature: '42°C',
    cpuUsage: 24,
    ramUsage: '3.2 / 8 GB',
    storageFree: '42.8 GB',
    uptime: '14d 8h 22m',
    lastSeen: 'Just now',
    currentPlaylistId: 'pl-1',
    currentMediaId: 'med-1',
    playbackState: 'playing', // 'playing' | 'paused' | 'stopped' | 'rebooting'
    instantMediaId: null
  },
  {
    id: 'scr-2',
    name: 'Corporate HQ Main Lobby Wall',
    location: 'Building A, 1st Floor Atrium',
    resolution: '1920x1080',
    aspectRatio: '16:9',
    orientation: 'landscape',
    deviceId: 'PLAYER-HQ-101',
    pairingCode: 'SF-4421',
    status: 'online',
    connectionMethod: 'PoE Ethernet',
    ipAddress: '10.0.4.12',
    signalStrength: 92,
    brightness: 70,
    volume: 40,
    isMuted: false,
    temperature: '38°C',
    cpuUsage: 18,
    ramUsage: '2.1 / 4 GB',
    storageFree: '18.5 GB',
    uptime: '4d 12h 05m',
    lastSeen: '1 min ago',
    currentPlaylistId: 'pl-2',
    currentMediaId: 'med-3',
    playbackState: 'playing',
    instantMediaId: null
  },
  {
    id: 'scr-3',
    name: 'Downtown Retail Store Window',
    location: '5th Avenue Flagship Store',
    resolution: '1080x1920',
    aspectRatio: '9:16',
    orientation: 'portrait',
    deviceId: 'PLAYER-RT-209',
    pairingCode: 'SF-8834',
    status: 'syncing',
    connectionMethod: '5G Cellular Modem',
    ipAddress: '172.16.8.55',
    signalStrength: 76,
    brightness: 90,
    volume: 0,
    isMuted: true,
    temperature: '45°C',
    cpuUsage: 68,
    ramUsage: '3.8 / 4 GB',
    storageFree: '9.2 GB',
    uptime: '1d 04h 12m',
    lastSeen: 'Syncing (84%)',
    currentPlaylistId: 'pl-1',
    currentMediaId: 'med-4',
    playbackState: 'playing',
    instantMediaId: null
  },
  {
    id: 'scr-4',
    name: 'Airport Terminal 3 Concourse',
    location: 'Gate B12 Overhead Ribbon',
    resolution: '5120x1440',
    aspectRatio: '32:9',
    orientation: 'landscape',
    deviceId: 'PLAYER-AP-303',
    pairingCode: 'SF-1190',
    status: 'online',
    connectionMethod: 'Fiber Gigabit (VLAN 40)',
    ipAddress: '10.200.1.88',
    signalStrength: 99,
    brightness: 100,
    volume: 0,
    isMuted: true,
    temperature: '39°C',
    cpuUsage: 31,
    ramUsage: '4.5 / 8 GB',
    storageFree: '64.1 GB',
    uptime: '28d 19h 40m',
    lastSeen: 'Just now',
    currentPlaylistId: 'pl-3',
    currentMediaId: 'med-5',
    playbackState: 'playing',
    instantMediaId: null
  },
  {
    id: 'scr-5',
    name: 'Convention Center Stage Left',
    location: 'Main Exhibition Hall 2',
    resolution: '1920x1080',
    aspectRatio: '16:9',
    orientation: 'landscape',
    deviceId: 'PLAYER-CC-704',
    pairingCode: 'SF-5502',
    status: 'offline',
    connectionMethod: 'Wi-Fi 6 (Corporate Mesh)',
    ipAddress: '192.168.10.150',
    signalStrength: 0,
    brightness: 50,
    volume: 0,
    isMuted: true,
    temperature: 'Offline',
    cpuUsage: 0,
    ramUsage: 'N/A',
    storageFree: '32.0 GB',
    uptime: 'Offline',
    lastSeen: '2 hours ago',
    currentPlaylistId: null,
    currentMediaId: null,
    playbackState: 'stopped',
    instantMediaId: null
  },
  {
    id: 'scr-6',
    name: 'Metro Transit Station Concourse',
    location: 'Central Station Platform 3',
    resolution: '1080x1920',
    aspectRatio: '9:16',
    orientation: 'portrait',
    deviceId: 'PLAYER-TR-808',
    pairingCode: 'SF-3341',
    status: 'online',
    connectionMethod: '5G Industrial Cellular',
    ipAddress: '172.24.12.90',
    signalStrength: 88,
    brightness: 80,
    volume: 25,
    isMuted: false,
    temperature: '41°C',
    cpuUsage: 29,
    ramUsage: '2.8 / 4 GB',
    storageFree: '21.4 GB',
    uptime: '9d 14h 50m',
    lastSeen: 'Just now',
    currentPlaylistId: 'pl-4',
    currentMediaId: 'med-7',
    playbackState: 'playing',
    instantMediaId: null
  }
];

export const initialSchedules = [
  {
    id: 'sch-1',
    title: 'Morning Executive Corporate Broadcast',
    playlistId: 'pl-2',
    screenIds: ['scr-2'],
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    startTime: '08:00',
    endTime: '11:00',
    recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    priority: 'high', // 'normal' | 'high' | 'emergency'
    activeStatus: 'active'
  },
  {
    id: 'sch-2',
    title: 'Peak Evening Retail Campaign Override',
    playlistId: 'pl-1',
    screenIds: ['scr-1', 'scr-3'],
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    startTime: '17:00',
    endTime: '21:00',
    recurringDays: ['Fri', 'Sat', 'Sun'],
    priority: 'high',
    activeStatus: 'active'
  },
  {
    id: 'sch-3',
    title: 'Weekend Nightlife Music Showcase',
    playlistId: 'pl-4',
    screenIds: ['scr-6'],
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    startTime: '21:00',
    endTime: '02:00',
    recurringDays: ['Fri', 'Sat'],
    priority: 'normal',
    activeStatus: 'active'
  }
];

export const initialSystemLogs = [
  {
    id: 'log-101',
    timestamp: '2026-09-22T10:45:12Z',
    deviceId: 'PLAYER-NY-4K01',
    screenName: 'Times Square Billboard North',
    action: 'PLAYLIST_SYNC_SUCCESS',
    details: 'Synced bundle PL-1 (3 media items, 87.9 MB total)',
    status: 'success',
    latency: '42ms'
  },
  {
    id: 'log-102',
    timestamp: '2026-09-22T10:30:04Z',
    deviceId: 'PLAYER-RT-209',
    screenName: 'Downtown Retail Store Window',
    action: 'REMOTE_BRIGHTNESS_SET',
    details: 'Brightness updated to 90% via phone remote console',
    status: 'success',
    latency: '28ms'
  },
  {
    id: 'log-103',
    timestamp: '2026-09-22T09:12:55Z',
    deviceId: 'PLAYER-CC-704',
    screenName: 'Convention Center Stage Left',
    action: 'HEARTBEAT_TIMEOUT',
    details: 'No ping received for 600s. Device flagged offline.',
    status: 'warning',
    latency: 'TIMEOUT'
  },
  {
    id: 'log-104',
    timestamp: '2026-09-22T08:00:00Z',
    deviceId: 'PLAYER-HQ-101',
    screenName: 'Corporate HQ Main Lobby Wall',
    action: 'SCHEDULE_TRIGGERED',
    details: 'Applied High-Priority Schedule: Morning Executive Corporate Broadcast',
    status: 'success',
    latency: '15ms'
  }
];
