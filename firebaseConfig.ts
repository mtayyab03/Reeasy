import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAMHvnoOtpkUrAodgNM20tS9yN8_aU8rp0",
  authDomain: "reeasy-80fd1.firebaseapp.com",
  projectId: "reeasy-80fd1",
  storageBucket: "reeasy-80fd1.firebasestorage.app",
  messagingSenderId: "507957892584",
  appId: "1:507957892584:web:27cd11c3d86acee518c05d",
  measurementId: "G-KJTPLDZVE3",
};

// ✅ Initialize App
const app = initializeApp(firebaseConfig);

// ✅ Firebase Services for Chat
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
