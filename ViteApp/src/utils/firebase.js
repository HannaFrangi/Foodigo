// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCYUIfiZEdqmr2XbdSP0tdtMrAiAeL6IaM",

  authDomain: "hdarne-3d2b6.firebaseapp.com",

  projectId: "hdarne-3d2b6",

  storageBucket: "hdarne-3d2b6.appspot.com",

  messagingSenderId: "137464243804",

  appId: "1:137464243804:web:933b0aeddfd4c6d72ca899",

  measurementId: "G-TT3XYP63T1",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// Register the service worker
navigator.serviceWorker.register("/firebase-messaging-sw.js", {
  type: "module",
});

export { messaging, app };
