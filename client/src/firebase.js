// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-978ef.firebaseapp.com",
  projectId: "mern-blog-978ef",
  storageBucket: "mern-blog-978ef.firebasestorage.app",
  messagingSenderId: "6921099007",
  appId: "1:6921099007:web:98c86090c6e8cc2b949eca"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);