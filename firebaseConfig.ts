import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAAbBFSMiG1npx_P6qrZKHw3_XbM4ODF-U",
    authDomain: "gravitygrit-5768a.firebaseapp.com",
    projectId: "gravitygrit-5768a",
    storageBucket: "gravitygrit-5768a.appspot.com",
    messagingSenderId: "176316458266",
    appId: "1:176316458266:web:6f12f2ceac10e30f3db8a3",
    measurementId: "G-2EHXPDS31G"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
