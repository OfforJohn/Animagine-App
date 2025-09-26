// src/firebase/firebase.ts

import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendPasswordResetEmail,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
} from "firebase/firestore";
import {
  getStorage,
  FirebaseStorage,
} from "firebase/storage";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBZhaoVeoxL_XhHVvBzT2MIqhCi6ZXRfes",
  authDomain: "myshop-96d79.firebaseapp.com",
  projectId: "myshop-96d79",
  storageBucket: "myshop-96d79.appspot.com", // ⚠️ Fixed typo here: ".app" → ".com"
  messagingSenderId: "598877577223",
  appId: "1:598877577223:web:6d395cf64eeb5be3f2caa2",
  measurementId: "G-W86TYXYG1D",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services with correct types
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// ✅ Utility: Reset password function
export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};
