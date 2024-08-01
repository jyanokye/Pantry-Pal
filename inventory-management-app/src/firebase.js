// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoKhjJsDAItWgr3n9RtiKit3Ux1xdXReA",
  authDomain: "inventory-management-app-af853.firebaseapp.com",
  projectId: "inventory-management-app-af853",
  storageBucket: "inventory-management-app-af853.appspot.com",
  messagingSenderId: "524630538701",
  appId: "1:524630538701:web:befb1fbfe66e135dc5ac84",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
export { firestore };