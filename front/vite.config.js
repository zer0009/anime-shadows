import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sentryVitePlugin from '@sentry/vite-plugin' // Optional: If using Sentry for error tracking
import { resolve } from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Destructure necessary environment variables
const {
  SENTRY_AUTH_TOKEN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  VITE_RELEASE, // Ensure this is set during deployment
} = process.env

export default defineConfig({
  plugins: [
    react(),
    // Optional: Integrate Sentry Vite plugin for error tracking with source maps
    sentryVitePlugin({
      org: SENTRY_ORG || '',
      project: SENTRY_PROJECT || '',
      authToken: SENTRY_AUTH_TOKEN || '',
      release: VITE_RELEASE || 'anime-shadows@1.0.0',
      include: './dist', // Directory with build assets
      ignore: ['node_modules', 'vite.config.js'], // Files to ignore
    }),
  ],
  build: {
    sourcemap: true, // Enable source map generation for debugging
    outDir: 'dist',
    minify: 'terser', // Use Terser for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split vendor code into separate chunks for better caching
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Adjust as needed
  },
  optimizeDeps: {
    include: [
      // Pre-bundle frequently used dependencies
      'react',
      'react-dom',
      'react-router-dom',
      'react-ga4',
      'i18next',
      'react-helmet-async',
      // Add other dependencies as needed
    ],
    exclude: [
      // Exclude large libraries if you plan to load them dynamically
      'lodash',
      // Add other large dependencies to exclude from pre-bundling
    ],
  },
  publicDir: 'public',
})