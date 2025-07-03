// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config (corrected storageBucket)
const firebaseConfig = {
  apiKey: "AIzaSyBCc2xdoUZt4nIy69ptn1wwFaG5Ikz2m5Y",
  authDomain: "todo-app-eb750.firebaseapp.com",
  projectId: "todo-app-eb750",
  storageBucket: "todo-app-eb750.appspot.com",   // fixed here
  messagingSenderId: "598589868606",
  appId: "1:598589868606:web:32e810b9e071e6bd7c5f6f",
  measurementId: "G-K45STSV4HC"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
