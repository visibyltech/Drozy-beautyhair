import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8ik3NuV7UoDAwS5gJ2KWwSsPWve0Y4cI",
  authDomain: "d-rosybeauty-hair.firebaseapp.com",
  projectId: "d-rosybeauty-hair",
  storageBucket: "d-rosybeauty-hair.firebasestorage.app",
  messagingSenderId: "1014818970110",
  appId: "1:1014818970110:web:738c43d12ca1af16d448af"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
