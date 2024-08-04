import { collection, getDocs, query, orderBy, Firestore } from 'firebase/firestore';
import { db } from './firebase';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate?: string;
  imageUrl?: string;
}

export async function getPantryItems(): Promise<PantryItem[]> {
  if (typeof window === 'undefined' || !db) {
    // Server-side or db not initialized: return empty array
    return [];
  }

  try {
    const q = query(collection(db as Firestore, 'pantryItems'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      quantity: doc.data().quantity,
      unit: doc.data().unit,
      expirationDate: doc.data().expirationDate,
      imageUrl: doc.data().imageUrl
    } as PantryItem));
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    return [];
  }
}