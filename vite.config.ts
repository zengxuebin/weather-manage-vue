import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  css: {  
    preprocessorOptions: {  
      scss: {  
        silenceDeprecations: ['legacy-js-api', 'color-functions'],  
      },  
    },  
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/weather': {
        target: 'http://localhost:8080/weather/',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/weather/, '')
      }
    }
  }
})
