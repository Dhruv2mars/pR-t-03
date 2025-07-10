import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['sql.js']
  },
  build: {
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      include: [/sql\.js/, /node_modules/]
    },
    target: 'es2020'
  },
  define: {
    global: 'globalThis',
  }
})