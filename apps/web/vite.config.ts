import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['sql.js'],
  },
  server: {
    fs: {
      allow: ['..', '../..']
    }
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})