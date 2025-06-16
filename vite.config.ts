import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/portfolio-project/',
  build: {
    outDir: 'docs', // <-- Add this line
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});