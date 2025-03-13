import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyCZJvy_b4QXOJ_W-T0Q5e27miqnEzbMzeM",
   authDomain: "fulcrums-ca.firebaseapp.com",
   projectId: "fulcrums-ca",
   storageBucket: "fulcrums-ca.firebasestorage.app",
   messagingSenderId: "280765019999",
   appId: "1:280765019999:web:e08a7c2db8b99effae28ea",
   measurementId: "G-FR839KJB07",
};

export const actionCodeSettings = {
   url: "https://fulcrums.ca/dashboard",
   handleCodeInApp: true,
   linkDomain: "https://fulcrums.ca",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const db = initializeFirestore(app, {
   localCache: persistentLocalCache(),
});