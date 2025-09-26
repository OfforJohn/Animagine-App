// src/firebase/firestore.ts
import {
  collection,
  addDoc,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// Add a new document to a Firestore collection
export const addItem = async (
  collectionName: string,
  data: DocumentData
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding document:", error.message);
    } else {
      console.error("Unknown error adding document:", error);
    }
  }
};

// Get all documents from a Firestore collection
export const getItems = async (
  collectionName: string
): Promise<Array<{ id: string } & DocumentData> | undefined> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));

    // Each doc is a QueryDocumentSnapshot<DocumentData>
    const items = querySnapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    return items;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting documents:", error.message);
    } else {
      console.error("Unknown error getting documents:", error);
    }
  }
};
