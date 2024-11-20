import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
      sourcemap: true, // Enable source map generation
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
  },
  publicDir: 'public',
  optimizeDeps: {
    include: [
      // Pre-bundle dependencies to improve performance
      'react',
      'react-dom',
      'react-router-dom',
      // Add other dependencies as needed
    ],
  },
})