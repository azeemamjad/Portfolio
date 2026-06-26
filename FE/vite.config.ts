import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: Number(env.FRONTEND_PORT || 3000),
      allowedHosts: ['dev-link.cloud', 'www.dev-link.cloud', 'localhost'],
      hmr: env.VITE_HMR_HOST
        ? {
            host: env.VITE_HMR_HOST,
            clientPort: Number(env.VITE_HMR_CLIENT_PORT || 443),
            protocol: (env.VITE_HMR_PROTOCOL || 'wss') as 'ws' | 'wss',
          }
        : undefined,
    },
    preview: {
      host: '0.0.0.0',
      port: Number(env.FRONTEND_PORT || 3000),
    },
  }
})