
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCauad0MN6CoRn81R0A675vbS8cQe9Dwv4",
  authDomain: "agriverse-22076.firebaseapp.com",
  projectId: "agriverse-22076",
  storageBucket: "agriverse-22076.appspot.com",
  messagingSenderId: "843451134976",
  appId: "1:843451134976:web:3626f33cbb47d0fea714e5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
