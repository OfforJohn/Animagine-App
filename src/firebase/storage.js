// src/firebase/storage.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Import the initialized storage instance

// Upload a file to Firebase Storage
export const uploadFile = async (file, path) => {
  const fileRef = ref(storage, path);
  try {
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error uploading file: ", error.message);
  }
};

// Get a file URL from Firebase Storage
export const getFileURL = async (path) => {
  const fileRef = ref(storage, path);
  try {
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error getting file URL: ", error.message);
  }
};
