import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './stories'),
      '@steding/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@steding/timeline-scroll': path.resolve(__dirname, '../../packages/timeline-scroll/src'),
    },
  },
});
