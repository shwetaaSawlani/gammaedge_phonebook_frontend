import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:5000', // <--- IMPORTANT: Use HTTPS here for your backend
        changeOrigin: true,
        secure: false, // <--- Add this line to ignore self-signed certificate errors
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep this if your backend expects /api prefix
      },
    },
    // Optional: If your FRONTEND also needs to run on HTTPS for some reason
    // https: true, // This would enable HTTPS for your Vite dev server itself
  },
});