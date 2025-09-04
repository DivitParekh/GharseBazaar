// src/firebase/config.js

// Firebase core functions
import { initializeApp } from "firebase/app";

// Firebase services you are using
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAbB5Cs0qe7S-OjW723NeaunfLgiPmjMvg",
  authDomain: "gharsebazaar.firebaseapp.com",
  projectId: "gharsebazaar",
  storageBucket: "gharsebazaar.firebasestorage.app",
  messagingSenderId: "909515943183",
  appId: "1:909515943183:web:ab3bfc49f238a3f9ca227a",
  measurementId: "G-2NC5NQLD7H"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export the services you need
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
