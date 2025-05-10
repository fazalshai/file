// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBo4jR45znsKaZz1XdpekijZa3kTIuiqRc",
  authDomain: "anyfile-a7003.firebaseapp.com",
  projectId: "anyfile-a7003",
  storageBucket: "anyfile-a7003.appspot.com",
  messagingSenderId: "358624822591",
  appId: "1:358624822591:web:035d5daa1a36164bbd7f8a",          
  measurementId: "G-FMFP36NHVN"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
