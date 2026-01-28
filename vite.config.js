import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5880,
    proxy: {
      // Dev: avoid CORS, keep frontend calling `/api/*`
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      // Dev: allow opening `/files/*` from frontend origin as well.
      '/files': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 5880
  }
})
