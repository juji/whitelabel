
// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDXh4ur7Q8bYCK4f1Ph3Jr74DKsWBWJl4U",
  authDomain: "whitelabel-153f7.firebaseapp.com",
  projectId: "whitelabel-153f7",
  storageBucket: "whitelabel-153f7.appspot.com",
  messagingSenderId: "906531902390",
  appId: "1:906531902390:web:6e65976f6e6a06783a2717",
  measurementId: "G-Y27N0VDXH8"
};

// Initialize Firebase
export const app = () => initializeApp(firebaseConfig);
export const analytics = (app:FirebaseApp) => getAnalytics(app);
