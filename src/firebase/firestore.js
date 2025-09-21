// src/firebase/firestore.js
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "./firebase"; // Import the initialized firestore instance

// Add a new document to a Firestore collection
export const addItem = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(firestore, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error.message);
  }
};

// Get all documents from a Firestore collection
export const getItems = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return items;
  } catch (error) {
    console.error("Error getting documents: ", error.message);
  }
};
