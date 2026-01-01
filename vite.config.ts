import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  build: {
    outDir: 'build',
    // Chrome extensions need predictable file names (no hashes)
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name].js',
        chunkFileNames: 'static/js/[name].js',
        assetFileNames: 'static/[ext]/[name].[ext]',
      },
    },
    // Don't inline assets as data URLs
    assetsInlineLimit: 0,
  },
});

