// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
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

// Request FCM token for foreground notifications
export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BHeUXSawvudM9P0Ei0ON4luJSTttFSiyihWHF7F-9jK1P2o9I4XYHaCHT2_mw8BbHgABaWgfrEhadFIX7KVjzCQ",
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.error("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error getting notification token:", error);
  }
};

// Foreground message handler (when the app is in the foreground)
onMessage(messaging, (payload) => {
  console.log("Foreground message received: ", payload);
  // Handle the notification (showing an alert for demonstration)
  const { title, body } = payload.notification;
  alert(`${title}: ${body}`);
});

export { messaging, app };
