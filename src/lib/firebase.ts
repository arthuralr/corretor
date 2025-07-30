
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "realconnect-crm",
  appId: "1:266116411962:web:69a6f62187d4a64fa67b03",
  storageBucket: "realconnect-crm.appspot.com",
  apiKey: "AIzaSyAwDZSIxuRLHzpW-k5ax6xuJqyhCaWSXTg",
  authDomain: "realconnect-crm.firebaseapp.com",
  messagingSenderId: "266116411962",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
