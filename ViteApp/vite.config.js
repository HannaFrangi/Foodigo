import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
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
