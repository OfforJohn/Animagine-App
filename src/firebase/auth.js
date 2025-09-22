// src/firebase/auth.js
import { auth } from "./firebase";

// Sign up user with email and password
export const signUp = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up: ", error.message);
  }
};

// Sign in user with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in: ", error.message);
  }
};

// Sign out user
export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out: ", error.message);
  }
};

// Listen to auth state changes
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
