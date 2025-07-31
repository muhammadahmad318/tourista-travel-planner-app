const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC-Y1ScI6QutFl1QwwrOllCLFMhxQxwbTs",
  authDomain: "tourista-9ae06.firebaseapp.com",
  projectId: "tourista-9ae06",
  storageBucket: "tourista-9ae06.firebasestorage.app",
  messagingSenderId: "475449878417",
  appId: "1:475449878417:web:9404119425319eebe0dc30",
  measurementId: "G-CYCTQTQEME",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { app, auth, db };
