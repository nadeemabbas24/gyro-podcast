// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzSwMLPL66_BVOktm-Cdx7lkD09bHF-eE",
  authDomain: "podcastapp-9529f.firebaseapp.com",
  projectId: "podcastapp-9529f",
  storageBucket: "podcastapp-9529f.appspot.com",
  messagingSenderId: "101851186407",
  appId: "1:101851186407:web:9953030f543757324dce42",
  measurementId: "G-JGDX6D05RE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics };
