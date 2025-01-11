// Import the necessary Firebase modules for the service worker
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Your Firebase configuration
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
const messaging = getMessaging(app);

// Handle background messages when the app is not in the foreground
onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message received:",
    payload
  );

  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/logo.png", // Customize the icon here
  };

  // Show the notification
  self.registration.showNotification(title, notificationOptions);
});
