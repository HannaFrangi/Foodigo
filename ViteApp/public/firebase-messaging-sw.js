// public/firebase-messaging-sw.js
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

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

// Handle Background Messages
const messaging = getMessaging(app);
onBackgroundMessage(messaging, (payload) => {
  console.log("Received background message: ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
