/**
 * Firebase Configuration and Initialization Service
 * Supports both environment variables (.env) and runtime UI configuration via LocalStorage.
 * Connects to Cloud Firestore & Firebase Auth with automatic sync capabilities.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const STORAGE_KEY = 'apex_firebase_config_v1';

/**
 * Get current Firebase Config from environment or LocalStorage
 */
export function getFirebaseConfig() {
  const localSaved = localStorage.getItem(STORAGE_KEY);
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved Firebase config from localStorage:', e);
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
}

let app = null;
let db = null;
let auth = null;

export function initFirebase(customConfig = null) {
  const config = customConfig || getFirebaseConfig();
  const isConfigured = Boolean(config.apiKey && config.projectId);

  if (!isConfigured) {
    return {
      success: false,
      message: 'Firebase keys not set. Running in Local Storage Reactive Mode.',
      db: null,
      auth: null
    };
  }

  try {
    if (getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(config);
    }
    db = getFirestore(app);
    auth = getAuth(app);

    // Save valid config to local storage
    if (customConfig) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customConfig));
    }

    return {
      success: true,
      message: `Successfully connected to Firebase Project: "${config.projectId}"`,
      db,
      auth
    };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return {
      success: false,
      message: `Firebase error: ${err.message}`,
      db: null,
      auth: null
    };
  }
}

// Initial auto-initialization
const currentInit = initFirebase();
export const isFirebaseConnected = currentInit.success;
export { app, db, auth };

/**
 * Save and test Firebase config dynamically from settings UI
 */
export function saveFirebaseConfig(newConfig) {
  return initFirebase(newConfig);
}

/**
 * Firestore Sync Helpers for ScreenFlow Digital Signage
 */
export async function syncScreenToFirestore(screen) {
  if (!db || !screen?.id) return;
  try {
    const docRef = doc(db, 'screens', screen.id);
    await setDoc(docRef, screen, { merge: true });
  } catch (err) {
    console.warn('Firestore screen sync error:', err);
  }
}

export async function syncPlaylistToFirestore(playlist) {
  if (!db || !playlist?.id) return;
  try {
    const docRef = doc(db, 'playlists', playlist.id);
    await setDoc(docRef, playlist, { merge: true });
  } catch (err) {
    console.warn('Firestore playlist sync error:', err);
  }
}

export async function fetchFirestoreCollection(collectionName) {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items = [];
    querySnapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() });
    });
    return items;
  } catch (err) {
    console.warn(`Firestore fetch error for ${collectionName}:`, err);
    return [];
  }
}
