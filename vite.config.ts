import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/Nexora/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,
  },
});
