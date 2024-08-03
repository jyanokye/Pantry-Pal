// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDoKhjJsDAItWgr3n9RtiKit3Ux1xdXReA',
  authDomain: 'inventory-management-app-af853.firebaseapp.com',
  projectId: 'inventory-management-app-af853',
  storageBucket: 'inventory-management-app-af853.appspot.com',
  messagingSenderId: '524630538701',
  appId: '1:524630538701:web:befb1fbfe66e135dc5ac84',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, firestore, analytics };
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
