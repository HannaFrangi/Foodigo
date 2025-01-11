// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration

export const firebaseConfig = {
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

export const FIREBASE_VAPID_KEY =
  "BHeUXSawvudM9P0Ei0ON4luJSTttFSiyihWHF7F-9jK1P2o9I4XYHaCHT2_mw8BbHgABaWgfrEhadFIX7KVjzCQ";

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: FIREBASE_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      } else {
        alert(
          "No registration token available. Request permission to generate one."
        );
        return null;
      }
    })
    .catch((err) => {
      alert("An error occurred while retrieving token - " + err);
      return null;
    });
};

onMessage(messaging, ({ notification }) => {
  new Notification(notification.title, {
    body: notification.body,
    icon: notification.icon,
  });
});
