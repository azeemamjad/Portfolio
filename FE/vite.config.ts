import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',        // allow external access
    port: 3000,
    allowedHosts: ['dev-link.cloud', 'www.dev-link.cloud'],
  }
})