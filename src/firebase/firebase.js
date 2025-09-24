// src/firebase/firebase.js
import { initializeApp } from "firebase/app";  // Import initializeApp from modular SDK
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Import getFirestore from modular SDK
import { getStorage } from "firebase/storage";  // Import getStorage from modular SDK

// Your Firebase config object from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBZhaoVeoxL_XhHVvBzT2MIqhCi6ZXRfes",
  authDomain: "myshop-96d79.firebaseapp.com",
  projectId: "myshop-96d79",
  storageBucket: "myshop-96d79.firebasestorage.app",
  messagingSenderId: "598877577223",
  appId: "1:598877577223:web:6d395cf64eeb5be3f2caa2",
  measurementId: "G-W86TYXYG1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// ✅ Forgot password function
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};