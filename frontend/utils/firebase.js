// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "open-tube-1d91d.firebaseapp.com",
  projectId: "open-tube-1d91d",
  storageBucket: "open-tube-1d91d.firebasestorage.app",
  messagingSenderId: "31200094298",
  appId: "1:31200094298:web:5847b4b2ec476ab768d063"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}