// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCIQ1qqxUQd0aFkfnyvsDuuPvCaZBlANoU",
  authDomain: "gen-lang-client-0024641983.firebaseapp.com",
  projectId: "gen-lang-client-0024641983",
  storageBucket: "gen-lang-client-0024641983.firebasestorage.app",
  messagingSenderId: "805617188144",
  appId: "1:805617188144:web:eed79ebb59cc9076039cf5"
};

// Initialize Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export * from './firebase/config';
