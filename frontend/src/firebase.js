// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgdElZRPrI5wubT7lFuqySz3CzWTuZ99s",
  authDomain: "smart-courier-service.firebaseapp.com",
  projectId: "smart-courier-service",
  storageBucket: "smart-courier-service.firebasestorage.app",
  messagingSenderId: "604970254437",
  appId: "1:604970254437:web:55cbcc4b8df1213fb1c68c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
