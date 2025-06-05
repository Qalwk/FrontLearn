import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './components'),
      '@contexts': path.resolve(__dirname, './contexts'),
      '@data': path.resolve(__dirname, './data'),
      '@styles': path.resolve(__dirname, './styles'),
      '@types': path.resolve(__dirname, './types'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@app': path.resolve(__dirname, './src/app')
    },
  },
  css: {
    postcss: './postcss.config.cjs',
  },
});