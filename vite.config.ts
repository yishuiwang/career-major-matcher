import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/moe': {
        target: 'https://hudong.moe.gov.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/moe/, ''),
        secure: true,
        headers: {
          'Referer': 'https://hudong.moe.gov.cn'
        }
      }
    }
  }
})
