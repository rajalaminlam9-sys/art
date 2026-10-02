import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { Artwork, ArtistProfile, Order, User } from '../types';
import { INITIAL_ARTWORKS, INITIAL_ARTISTS, INITIAL_ORDERS, INITIAL_USERS } from './seedData';

// User's explicit Firebase configuration for artnova-bd1b7
export const firebaseConfig = {
  apiKey: 'AIzaSyBWxPHpENijx6VwKO3UQbXqfg9-hx5zOmU',
  authDomain: 'artnova-bd1b7.firebaseapp.com',
  projectId: 'artnova-bd1b7',
  storageBucket: 'artnova-bd1b7.firebasestorage.app',
  messagingSenderId: '820245158839',
  appId: '1:820245158839:web:06698f7c72dc4e561be632',
  measurementId: 'G-602D5255BD',
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Auth with user's project
export const db = getFirestore(app);
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics if supported in the browser
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline: checking configuration or network connectivity.');
    }
    return false;
  }
}

// --- Google Sign-In Authentication Method ---

export async function signInWithGoogle(): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const userRef = doc(db, 'users', fbUser.uid);
    let appUser: User;

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        appUser = snap.data() as User;
      } else {
        appUser = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google Collector',
          email: fbUser.email || '',
          role: 'buyer',
          createdAt: new Date().toISOString(),
          profileImage: fbUser.photoURL || undefined,
        };
        await setDoc(userRef, appUser, { merge: true });
      }
    } catch {
      appUser = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Collector',
        email: fbUser.email || '',
        role: 'buyer',
        createdAt: new Date().toISOString(),
        profileImage: fbUser.photoURL || undefined,
      };
    }

    return { success: true, user: appUser };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    return {
      success: false,
      error: error.message || 'Google sign-in was cancelled or encountered an issue.',
    };
  }
}

export async function signOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// --- Data Operations with Error Handlers ---

export async function fetchAllArtworks(): Promise<Artwork[]> {
  const path = 'artworks';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as Artwork);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveArtworkDoc(artwork: Artwork): Promise<void> {
  const path = `artworks/${artwork.id}`;
  try {
    await setDoc(doc(db, 'artworks', artwork.id), artwork, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeArtworkDoc(artworkId: string): Promise<void> {
  const path = `artworks/${artworkId}`;
  try {
    await deleteDoc(doc(db, 'artworks', artworkId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchAllArtists(): Promise<ArtistProfile[]> {
  const path = 'artists';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as ArtistProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveArtistDoc(artist: ArtistProfile): Promise<void> {
  const path = `artists/${artist.id}`;
  try {
    await setDoc(doc(db, 'artists', artist.id), artist, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  const path = 'orders';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as Order);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveOrderDoc(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchAllUsers(): Promise<User[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as User);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveUserDoc(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Initial seed to populate database with rich catalog if currently empty
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'artworks'));
    if (snap.empty) {
      console.log('Seeding initial marketplace catalog to Firestore...');
      for (const art of INITIAL_ARTWORKS) {
        await setDoc(doc(db, 'artworks', art.id), art);
      }
      for (const artist of INITIAL_ARTISTS) {
        await setDoc(doc(db, 'artists', artist.id), artist);
      }
      for (const order of INITIAL_ORDERS) {
        await setDoc(doc(db, 'orders', order.id), order);
      }
      for (const user of INITIAL_USERS) {
        await setDoc(doc(db, 'users', user.id), user);
      }
      console.log('Firestore seed completed successfully.');
    }
  } catch (error) {
    console.warn('Firestore initial seed skipped or error:', error);
  }
}
