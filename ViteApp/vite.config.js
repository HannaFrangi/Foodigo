import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Foodigo Your Recipe Finder",
        short_name: "Foodigo",
        description: "Foodigo Your Recipe Finder Website",
        theme_color: "#5d6544",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        // target: "http://192.168.1.15:5001",
        target: "http://localhost:5001",
        changeOrigin: true, // Adjust for virtual host
        secure: false, // If using HTTP for development
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
