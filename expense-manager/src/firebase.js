// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFZbF769-UNCcZGbobmeSPLZ6ltRFDLjo",
  authDomain: "shishutsu-app.firebaseapp.com",
  projectId: "shishutsu-app",
  storageBucket: "shishutsu-app.firebasestorage.app",
  messagingSenderId: "558037010692",
  appId: "1:558037010692:web:4a6da90e825152ca98e851"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };