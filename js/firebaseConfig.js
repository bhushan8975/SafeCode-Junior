// === firebaseConfig.js ===
// ✅ Centralized Firebase initialization

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// === Your Firebase Configuration ===
const firebaseConfig = {
  apiKey: "AIzaSyB9nMht5GAOTujsK_K5vXocIhF9fMsqvvc",
  authDomain: "safecode-junior-ebda5.firebaseapp.com",
  projectId: "safecode-junior-ebda5",
  storageBucket: "safecode-junior-ebda5.appspot.com",
  messagingSenderId: "369508348125",
  appId: "1:369508348125:web:f186b6fc342a9d8e5beb34"
};

// === Initialize Firebase App ===
const app = initializeApp(firebaseConfig);

// === Initialize Firebase Services ===
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// === Export for use in other JS files ===
export { app, auth, db, storage };

console.log("✅ Firebase initialized successfully");
