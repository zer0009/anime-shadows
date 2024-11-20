import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    sourcemap: true, // Enable source map generation for debugging
    outDir: 'dist',
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