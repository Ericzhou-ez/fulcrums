import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyANbTK7idlri0R7xn5g4wd3PvBJ_dzKbjo",
   authDomain: "btd-assist.firebaseapp.com",
   projectId: "btd-assist",
   storageBucket: "btd-assist.firebasestorage.app",
   messagingSenderId: "962057276915",
   appId: "1:962057276915:web:b83ce0b370c6a9fd495686",
   measurementId: "G-1KL06ZSYC5",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app); 
export const googleAuth = new GoogleAuthProvider();
export const db = getFirestore(app);
