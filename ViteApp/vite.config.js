import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Recipe App',
        short_name: 'RecipeApp',
        description: 'Your favorite recipe management app',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
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
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
        globIgnores: ['**/*.map'],
        skipWaiting: true,
        clientsClaim: true,
        navigationPreload: true,
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target:
          process.env.NODE_ENV === 'production'
            ? 'http://localhost:5001'
            : 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 600, // Increase warning limit slightly
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'vendor-react': ['react', 'react-dom'],

          // Routing
          'vendor-router': ['react-router-dom'],

          // UI Libraries
          'vendor-ui': ['react-hot-toast', '@studio-freight/react-lenis'],

          // Analytics
          'vendor-analytics': ['react-gtm-module'],

          // Authentication pages
          'pages-auth': [
            './src/pages/Auth/AuthPage',
            './src/pages/Auth/ResetPassword',
            './src/pages/Auth/VerifyEmail',
          ],

          // Recipe related pages
          'pages-recipe': [
            './src/pages/Recipe/RecipePage',
            './src/pages/Recipe/RecipeDetails',
            './src/pages/Recipe/EditRecipePage',
            './src/components/RecipeDetails/RecipeHeader',
          ],

          // Utility pages
          'pages-utility': [
            './src/pages/Homepage',
            './src/pages/Favorites/Favorites',
            './src/pages/AddRecipe/AddRecipe',
            './src/pages/Groccery/GrocceryList',
            './src/pages/404/NotFound',
          ],

          // Store/State management
          store: ['./src/store/useAuthStore', './src/store/useRecipeStore'],

          // Layout components
          layout: ['./src/layout/PageLayout'],

          // Utilities
          utils: ['./src/utils/ChefHatSpinner'],
        },

        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split('/')
                .pop()
                .replace('.jsx', '')
                .replace('.js', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },

        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },

        entryFileNames: 'js/[name]-[hash].js',
      },
    },

    // Additional optimizations
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn',
        ],
      },
    },
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hot-toast',
      '@studio-freight/react-lenis',
    ],
  },
});
