// src/firebase/listeners.ts
import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// Replace "any" with DocumentData to match Firestore types
type Project = { id: string } & DocumentData;

/**
 * Sets up a real-time listener on a Firestore collection with optional filters.
 *
 * @param collectionName - Firestore collection to listen to
 * @param filters - Optional array of Firestore query constraints like where()
 * @param onUpdate - Callback called with array of documents on every update
 * @returns Unsubscribe function to stop listening
 */
export const listenToCollection = (
  collectionName: string,
  filters: QueryConstraint[] = [],
  onUpdate: (docs: Project[]) => void
): Unsubscribe => {
  const q = query(collection(db, collectionName), ...filters);

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const docs: Project[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
      onUpdate(docs);
    },
    (error) => {
      console.error("Firestore listener error:", error);
    }
  );

  return unsubscribe;
};
