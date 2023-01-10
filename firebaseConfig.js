// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF_9mW-ejJ4Htyl-8HBxg0kuxy27BbnL8",
  authDomain: "swadpiademo.firebaseapp.com",
  projectId: "swadpiademo",
  storageBucket: "swadpiademo.appspot.com",
  messagingSenderId: "925371204030",
  appId: "1:925371204030:web:41383f54a1692ff47279ef",
  measurementId: "G-0M1T12KZV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

