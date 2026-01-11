// Firebase JS SDK - Using Compat Layer for better React Native compatibility
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAbBFSMiG1npx_P6qrZKHw3_XbM4ODF-U",
  authDomain: "gravitygrit-5768a.firebaseapp.com",
  projectId: "gravitygrit-5768a",
  storageBucket: "gravitygrit-5768a.appspot.com",
  messagingSenderId: "176316458266",
  appId: "1:176316458266:web:6f12f2ceac10e30f3db8a3",
  measurementId: "G-2EHXPDS31G",
};

// Initialize Firebase App
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export instances using compat API
export const FIREBASE_APP = firebase.app();
export const FIREBASE_AUTH = firebase.auth();
export const FIRESTORE_DB = firebase.firestore();

console.log("🔥 Firebase initialized (compat mode)");
