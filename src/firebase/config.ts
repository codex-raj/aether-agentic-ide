// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { submitWaitlistToSupabase } from '../lib/supabase';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCIQ1qqxUQd0aFkfnyvsDuuPvCaZBlANoU",
  authDomain: "gen-lang-client-0024641983.firebaseapp.com",
  projectId: "gen-lang-client-0024641983",
  storageBucket: "gen-lang-client-0024641983.firebasestorage.app",
  messagingSenderId: "805617188144",
  appId: "1:805617188144:web:eed79ebb59cc9076039cf5",
  firestoreDatabaseId: "ai-studio-aetherideautonom-b509aaab-ce34-41ed-86ca-a94dfd23e450"
};

// Initialize Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL: Required by skill)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper: Join Waitlist
export async function submitWaitlistEntry(data: {
  email: string;
  fullName?: string;
  role?: string;
  preferredLanguage?: string;
}) {
  const path = 'waitlist';
  
  // Concurrently sync to Supabase database
  submitWaitlistToSupabase(data).catch((err) => {
    console.warn('Supabase waitlist sync deferred error:', err);
  });

  try {
    const docRef = await addDoc(collection(db, path), {
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName?.trim() || '',
      role: data.role?.trim() || 'Software Engineer',
      preferredLanguage: data.preferredLanguage?.trim() || 'Rust / TypeScript',
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return { success: false, error };
  }
}

// Helper: Sign In with Google
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Upsert user profile to Firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Developer',
        photoURL: user.photoURL || '',
        role: user.email === 'Rajsinha7462@gmail.com' ? 'admin' : 'user',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return user;
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/popup-blocked'
    ) {
      console.warn('Google sign-in popup was closed or cancelled by the user.');
      return null;
    }
    console.warn('Sign-in encounter notice:', error?.message || error);
    return null;
  }
}

// Helper: Sign Up with Email and Password
export async function signUpWithEmail(email: string, pass: string, displayName: string): Promise<FirebaseUser | null> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (res.user) {
      if (displayName.trim()) {
        try {
          await updateProfile(res.user, { displayName: displayName.trim() });
        } catch {
          // ignore profile update error
        }
      }
      const userRef = doc(db, 'users', res.user.uid);
      await setDoc(userRef, {
        userId: res.user.uid,
        email: res.user.email,
        displayName: displayName.trim() || email.split('@')[0] || 'Developer',
        photoURL: '',
        role: email.trim().toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    return res.user;
  } catch (err: any) {
    console.warn('Email sign up notice:', err?.message || err);
    throw err;
  }
}

// Helper: Sign In with Email and Password
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser | null> {
  try {
    const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return res.user;
  } catch (err: any) {
    console.warn('Email sign in notice:', err?.message || err);
    throw err;
  }
}

// Helper: Sign in as Developer (e.g. if popups blocked or sandbox testing)
export async function signInAsDeveloper(email: string, displayName: string): Promise<{ uid: string; email: string; displayName: string }> {
  try {
    let uid = 'usr_' + Math.random().toString(36).substring(2, 12);
    if (auth.currentUser) {
      uid = auth.currentUser.uid;
    } else {
      try {
        const anonRes = await signInAnonymously(auth);
        uid = anonRes.user.uid;
      } catch {
        // anonymous signin fallback
      }
    }
    const safeEmail = email.trim() || 'developer@aetheride.dev';
    const safeName = displayName.trim() || safeEmail.split('@')[0] || 'Developer';

    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      userId: uid,
      email: safeEmail,
      displayName: safeName,
      photoURL: '',
      role: safeEmail.toLowerCase() === 'rajsinha7462@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { uid, email: safeEmail, displayName: safeName };
  } catch (err) {
    console.warn('Developer auth notice:', err);
    return {
      uid: 'usr_' + Date.now(),
      email: email.trim() || 'developer@aetheride.dev',
      displayName: displayName.trim() || 'Developer'
    };
  }
}

// Helper: Sign Out
export async function signOutUser() {
  try {
    return await firebaseSignOut(auth);
  } catch (error) {
    console.warn('Sign-out notice:', error);
  }
}
