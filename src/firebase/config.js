import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_fdU6dMb_qvESIDnwCxOWXL7SZag714s",
  authDomain: "church-fund-tracker-96677.firebaseapp.com",
  projectId: "church-fund-tracker-96677",
  storageBucket: "church-fund-tracker-96677.firebasestorage.app",
  messagingSenderId: "485676176078",
  appId: "1:485676176078:web:ef76e9edf61c102c32769f",
  measurementId: "G-4QGCE5WR4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
