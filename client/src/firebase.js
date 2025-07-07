import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e4d6d.firebaseapp.com",
  projectId: "mern-blog-e4d6d",
  storageBucket: "mern-blog-e4d6d.firebasestorage.app",
  messagingSenderId: "830476332647",
  appId: "1:830476332647:web:dc78a22213fbfbcf966ec2",
};

export const app = initializeApp(firebaseConfig);
