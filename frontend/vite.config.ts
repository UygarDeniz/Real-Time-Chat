import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': env.VITE_BACKEND_URL || 'http://localhost:3000',
      },
      host: true,
    },
  };
});
