// src/firebase/firestore.ts
import { collection, addDoc, getDocs, CollectionReference, DocumentData } from "firebase/firestore";
import { db } from "./firebase"; // Use db to match your exports

// Add a new document to a Firestore collection
export const addItem = async (
  collectionName: string,
  data: DocumentData
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding document: ", error.message);
  }
};

// Get all documents from a Firestore collection
export const getItems = async (
  collectionName: string
): Promise<Array<{ id: string; [key: string]: any }> | undefined> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return items;
  } catch (error: any) {
    console.error("Error getting documents: ", error.message);
  }
};
