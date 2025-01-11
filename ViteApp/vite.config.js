import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["firebase-messaging-sw.js"], // Keep this to include the service worker in the build
      workbox: {
        // Cache page navigations (html) with a Network First strategy
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],

        runtimeCaching: [
          // Cache API calls
          {
            urlPattern: /^https?:\/\/api\.your-domain\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // Cache static assets (images, fonts, etc)
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },

          // Cache Google Fonts stylesheets
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },

          // Cache Google Fonts webfont files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },

          // Cache CSS and JavaScript files
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
            },
          },
        ],

        // Don't precache sourcemaps
        globIgnores: ["**/*.map"],

        // Skip waiting and clients claim
        skipWaiting: true,
        clientsClaim: true,

        // Enable navigation preload
        navigationPreload: true,
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true, // Adjust for virtual host
        secure: false, // If using HTTP for development
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
