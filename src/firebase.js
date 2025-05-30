// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOs4lNSgwTibZMfWTBCfgc2SiFXS_MPPE",
  authDomain: "mern-todo-app-a62f8.firebaseapp.com",
  projectId: "mern-todo-app-a62f8",
  storageBucket: "mern-todo-app-a62f8.appspot.com",
  messagingSenderId: "765191880656",
  appId: "1:765191880656:web:9fb7260a498690950083d5",
  measurementId: "G-G768KFRLN0",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const db = getFirestore(app);
export { db };
