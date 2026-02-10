import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - updated with complete API key
const firebaseConfig = {
  apiKey: "AIzaSyB-mziYuwxO7sH2NrJWPFalM56XiSRxMic",
  authDomain: "church-fund-tracker-2026.firebaseapp.com",
  projectId: "church-fund-tracker-2026",
  storageBucket: "church-fund-tracker-2026.firebasestorage.app",
  messagingSenderId: "555559390641",
  appId: "1:555559390641:web:845f21059ad1def105c190",
  measurementId: "G-E2BLBTH5NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
