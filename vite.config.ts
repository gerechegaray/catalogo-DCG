import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { analyzer } from 'vite-bundle-analyzer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    analyzer({
      analyzerMode: 'disabled', // Cambiar a 'server' para analizar
      openAnalyzer: false
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/context': path.resolve(__dirname, './src/context'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
