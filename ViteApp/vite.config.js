import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [react(), VitePWA()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend URL
        changeOrigin: true, // Adjust for virtual host
        secure: false, // If using HTTP for development
        rewrite: (path) => path.replace(/^\/api/, ""), // Rewrites /api to root path on the backend
      },
    },
  },
});
