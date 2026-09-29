# ScreenFlow — LED Screen & Digital Signage Management System

**ScreenFlow** is a modern, dark-themed Progressive Web App (PWA) designed for businesses, outdoor advertisers, corporate offices, venues, and events to manage network-connected LED screens and dedicated digital signage players without mirroring a laptop.

---

## 🌟 Key Features

1. **Dashboard & Virtual LED Mockup**
   - Live metrics summary: Total Screens, Online/Offline status, Active Playlists, and Storage Usage.
   - Interactive LED Screen Canvas simulating 16:9 landscape, 9:16 portrait, and 32:9 ultrawide aspect ratios.
   - LED pixel matrix grid simulation, real-time brightness overlays, and audio indicators.

2. **Screen & Hardware Management**
   - Add, edit, pair, and unbind physical LED screen nodes.
   - 6-digit device pairing codes (e.g. `SF-9012`).
   - Hardware telemetry tracking: CPU usage, core temperature, free storage, system uptime, and connection type (Fiber, 5G, Ethernet, Wi-Fi 6).

3. **Media Library**
   - Drag-and-drop video (MP4, WEBM) and image (JPG, PNG) asset upload.
   - Grid view with resolution badges, duration tags, and file sizes.
   - Search by title or hashtag (`#Promo`, `#Retail`, `#Event`).
   - Fullscreen video/image preview modal.

4. **Playlist Sequence Builder**
   - Drag & drop / sequence item order customizer.
   - Per-item display duration settings (photos & video clips).
   - Repeat/Loop modes (Continuous loop, Single pass, Shuffle).
   - Batch assign playlists to single or multiple LED displays.

5. **Time-Based Scheduling & Priority Engine**
   - Schedule playlists by date range, time window (e.g. 08:00 - 11:00), and recurring weekdays.
   - Priority levels: Scheduled rules override standard looping displays while active.
   - 24-hour visual horizontal gantt timeline forecast and rules manager.

6. **Mobile-Optimized Remote Control Console**
   - Big touch transport buttons: **Play**, **Pause**, **Stop**, **Restart**.
   - Immediate playlist switching and instant priority broadcast override.
   - Dynamic LED brightness slider (0% - 100%) and volume mute controls.
   - Hard hardware reboot pulse with simulated reboot sequence.
   - Command delivery log displaying WebSocket/API delivery latency (`Delivered in 28ms`).

7. **Live Content Mode**
   - Live scrolling news & event ticker text builder.
   - Emergency alert broadcast pusher (e.g. Fire Alarm, Severe Weather).
   - RTSP / RTMP IP Camera stream ingestion preview.

8. **Role-Based Access Control (RBAC)**
   - **Admin**: Full access (screens, users, media, playlists, schedules, pairing, reboots).
   - **Content Manager**: Upload media, edit playlists, and configure schedules.
   - **Viewer**: Read-only status monitoring and live playback telemetry.

---

## 📱 PWA & Mobile Installation

ScreenFlow is built as a responsive Progressive Web App:
- **Mobile Safari (iOS)**: Tap Share → *Add to Home Screen*.
- **Chrome / Android**: Tap the **Install App** button in the header or browser menu.
- **Desktop**: Click the **Phone View** button in the top bar to simulate one-handed smartphone control.

---

## 🔌 Hardware Integration & Player API Adapter Guide

ScreenFlow includes a clearly separated API adapter module located at [`src/services/playerApiAdapter.js`](file:///Users/chethankulai/antigravity/src/services/playerApiAdapter.js).

### How to Connect Real LED Hardware Players:
To connect physical players (e.g., BrightSign, Android Signage APKs, Raspberry Pi, Linux signage nodes):

1. **Replace Simulated Promises**:
   In `src/services/playerApiAdapter.js`, replace `delay()` and simulated responses with real HTTP REST requests (`fetch`/`axios`) or WebSocket / MQTT message dispatches to your backend API or MQTT broker:

   ```javascript
   // Example MQTT command dispatch replacement:
   async sendRemoteCommand(deviceId, command, payload) {
     return await mqttClient.publish(`screenflow/device/${deviceId}/cmd`, JSON.stringify({
       command,
       payload,
       timestamp: new Date().toISOString()
     }));
   }
   ```

2. **Player Hardware Telemetry Endpoint**:
   Ensure media players send periodic heartbeat pings (every 10s) with JSON telemetry:
   ```json
   {
     "deviceId": "PLAYER-NY-4K01",
     "pairingCode": "SF-9012",
     "cpuUsagePercent": 24,
     "coreTempCelsius": 42,
     "storageFreeGb": 42.8,
     "status": "HEALTHY",
     "currentMediaId": "med-1"
   }
   ```

3. **Content Download Sync Protocol**:
   When a playlist is assigned, players download media bundles locally to internal SSD/eMMC storage using `syncMediaBundle()`, allowing offline playback if internet connection drops.

---

## 🛠️ How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open in browser:
   `http://localhost:5173`

4. Verify build:
   ```bash
   npm run build
   ```
