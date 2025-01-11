// Import the Firebase scripts for the service worker
importScripts(
  "https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js"
);

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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/logo.png", // You can replace with your own icon
  };

  // Show the notification
  self.registration.showNotification(title, notificationOptions);
});
