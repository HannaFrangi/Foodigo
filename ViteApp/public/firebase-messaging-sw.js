importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js");

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
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload
  );
  const { title, body } = payload.notification;
  const notificationOptions = {
    body: body,
    icon: "/logo.png", // Optional: add your notification icon
  };
  self.registration.showNotification(title, notificationOptions);
});
