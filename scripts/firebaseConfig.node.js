const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyC-Y1ScI6QutFl1QwwrOllCLFMhxQxwbTs",
  authDomain: "tourista-9ae06.firebaseapp.com",
  projectId: "tourista-9ae06",
  storageBucket: "tourista-9ae06.appspot.com",
  messagingSenderId: "475449878417",
  appId: "1:475449878417:web:9404119425319eebe0dc30",
  measurementId: "G-CYCTQTQEME",
};

const app = initializeApp(firebaseConfig);

module.exports = { app };
