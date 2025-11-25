import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/sgdb': {
        target: 'https://www.steamgriddb.com/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sgdb/, ''),
      },
    },
  },
})
