import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCf4DUQuy9uJ7oaiSR80QQmjRUEFy6lPH4",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "devvercel-97c37.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "devvercel-97c37",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "devvercel-97c37.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "512350286028",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:512350286028:web:12fb146211ac2f705dd269",
    measurementId: "G-85FVX7PFM5"
};

// Initialize Firebase (singleton pattern)
let app: any;
let db: any;
let auth: any;

if (firebaseConfig.apiKey) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (error) {
        console.warn("Firebase initialization failed:", error);
    }
} else {
    console.warn("Firebase API key not found. Firebase features will not work.");
}

export { app, db, auth };
