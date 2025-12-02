// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMHvnoOtpkUrAodgNM20tS9yN8_aU8rp0",
  authDomain: "reeasy-80fd1.firebaseapp.com",
  projectId: "reeasy-80fd1",
  storageBucket: "reeasy-80fd1.firebasestorage.app",
  messagingSenderId: "507957892584",
  appId: "1:507957892584:web:27cd11c3d86acee518c05d",
  measurementId: "G-KJTPLDZVE3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
