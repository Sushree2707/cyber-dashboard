// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- YOUR FIREBASE CONFIG ---
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfXNOdlurg-csUxBqXjD4xaPHyjGAuRVk",
  authDomain: "cyber-risk-dashboard-f2c51.firebaseapp.com",
  projectId: "cyber-risk-dashboard-f2c51",
  storageBucket: "cyber-risk-dashboard-f2c51.firebasestorage.app",
  messagingSenderId: "371032030487",
  appId: "1:371032030487:web:1c0fd4d1f02698dbc78b52"
};


// --- INITIALIZE SERVICES ---
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);