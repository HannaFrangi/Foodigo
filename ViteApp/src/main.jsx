import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

import { registerSW } from "virtual:pwa-register";
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a prompt to the user to refresh the app
    if (confirm("New content available. Reload?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </BrowserRouter>
);
