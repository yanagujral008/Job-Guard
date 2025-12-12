// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAbbfR6gu6pomTWJ8Vt9fpbrT7kmMNABCg",
    authDomain: "careerguard-2384c.firebaseapp.com",
    projectId: "careerguard-2384c",
    storageBucket: "careerguard-2384c.firebasestorage.app",
    messagingSenderId: "688579856544",
    appId: "1:688579856544:web:7a5924d44332f34d92e1c5",
    measurementId: "G-XQNY24V1F1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
