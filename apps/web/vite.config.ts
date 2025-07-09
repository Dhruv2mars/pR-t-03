import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['sql.js'],
    exclude: ['@project/editor-core', '@project/db-utils']
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
    commonjsOptions: {
      include: [/sql\.js/, /node_modules/]
    }
  },
  define: {
    global: 'globalThis',
  }
})