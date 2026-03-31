import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,   // ← true = любой хост разрешён (только для локальной разработки!)
    hmr: {
      clientPort: 443
    }
  }
})