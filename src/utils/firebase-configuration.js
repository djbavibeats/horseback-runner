// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB26rrrQTVjcJGMGgndPXO420CO6Eh-BKw",
  authDomain: "horseback-runner.firebaseapp.com",
  projectId: "horseback-runner",
  storageBucket: "horseback-runner.appspot.com",
  messagingSenderId: "733377034484",
  appId: "1:733377034484:web:4d4b94f019fd540e0646a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)