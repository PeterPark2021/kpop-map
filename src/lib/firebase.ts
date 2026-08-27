import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';

// 실제 유효한 키인지 확인 (임시 문자열 '여기에'나 'your_' 배제)
export const isFirebaseConfigured = Boolean(
  apiKey &&
  projectId &&
  !apiKey.includes('여기에') &&
  !apiKey.includes('your_') &&
  !projectId.includes('여기에')
);

let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp({
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    });
    dbInstance = getFirestore(app);
  } catch (error) {
    console.warn('[Firebase] Fallback to Local Mock Mode.', error);
  }
}

export const db = dbInstance;