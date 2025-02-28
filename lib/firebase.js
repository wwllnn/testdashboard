// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4kP3LwGlkv_P-10Q9uf7_KQqFzCcj7P0",
  authDomain: "dashboard-1e89b.firebaseapp.com",
  projectId: "dashboard-1e89b",
  storageBucket: "dashboard-1e89b.firebasestorage.app",
  messagingSenderId: "376408618443",
  appId: "1:376408618443:web:ac01830d13b5fab7a2f24e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };