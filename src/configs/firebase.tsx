import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
   apiKey:
      import.meta.env.VITE_FIREBASE_API_KEY ||
      process.env.VITE_FIREBASE_API_KEY ||
      "MISSING",
   authDomain:
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
      process.env.VITE_FIREBASE_AUTH_DOMAIN ||
      "MISSING",
   projectId:
      import.meta.env.VITE_FIREBASE_PROJECT_ID ||
      process.env.VITE_FIREBASE_PROJECT_ID ||
      "fulcrums-ca",
   storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
      process.env.VITE_FIREBASE_STORAGE_BUCKET ||
      "MISSING",
   messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      "MISSING",
   appId:
      import.meta.env.VITE_FIREBASE_APP_ID ||
      process.env.VITE_FIREBASE_APP_ID ||
      "MISSING",
   measurementId:
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
      process.env.VITE_FIREBASE_MEASUREMENT_ID ||
      "MISSING",
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
export const db = getFirestore(app);