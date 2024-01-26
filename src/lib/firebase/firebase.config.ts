import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import "firebase/storage";
import firebase from "firebase/app";
// console.log(import.meta.env.VITE_storageBucket);

// interface CustomImportMeta extends ImportMeta {
//   env: {
//     [key: string]: string;
//   };
// }

// const { env } = import.meta as CustomImportMeta;

// Your web app's Firebase configuration

// todo: secure the api keys
const firebaseConfig = {
  apiKey: "AIzaSyCrKIzMiwx98YX_hQU8kEQwZ7nGtS8meqU",
  authDomain: "bistro-boss-29f2f.firebaseapp.com",
  projectId: "bistro-boss-29f2f",
  storageBucket: "bistro-boss-29f2f.appspot.com",
  messagingSenderId: "443202418476",
  appId: "1:443202418476:web:78fb82e5cd0fca1adade89",
  measurementId: "G-T45JC5ZSNV",
  // apiKey: env?.VITE_apiKey,
  // authDomain: env?.VITE_authDomain,
  // projectId: env?.VITE_projectId,
  // storageBucket: env?.VITE_storageBucket,
  // messagingSenderId: env?.VITE_messagingSenderId,
  // appId: env?.VITE_appId,
  // measurementId: env?.VITE_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig)

export const storage = getStorage(app);
