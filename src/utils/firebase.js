// Imports:
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


// Firebase Configuration:
const firebaseConfig = {
  apiKey: "AIzaSyAyXiGYKmud3TmAfYUbF9cmQwabagYgnjA",
  authDomain: "sessions-bot-7e4b4.firebaseapp.com",
  projectId: "sessions-bot-7e4b4",
  storageBucket: "sessions-bot-7e4b4.firebasestorage.app",
  messagingSenderId: "1092955560444",
  appId: "1:1092955560444:web:7355352a4d6d62740e3a79",
  measurementId: "G-9F25FR6QWV"
};


// Initialize App/Services
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Exports:
export {auth, analytics, db}