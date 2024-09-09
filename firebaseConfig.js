// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, update } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLGFEJFcjd-GGWn3PFeaw3DLSJQlUlmGk",
  authDomain: "ecobin-ed682.firebaseapp.com",
  databaseURL:
    "https://ecobin-ed682-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecobin-ed682",
  storageBucket: "ecobin-ed682.appspot.com",
  messagingSenderId: "146586031659",
  appId: "1:146586031659:web:43632b8a87bee2dbed7c6e",
  measurementId: "G-GLKZ84ET6E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database, ref, push, onValue, update };
