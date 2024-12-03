import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        theme_color: "#5d6544",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: "http://192.168.1.9:5001",
        target: "http://localhost:5001",
        changeOrigin: true, // Adjust for virtual host
        secure: false, // If using HTTP for development
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
