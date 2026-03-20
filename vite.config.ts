import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pages from '@hono/vite-cloudflare-pages';

export default defineConfig(({ mode }) => {
  // Client build configuration
  if (mode === 'client') {
    return {
      base: './',
      plugins: [react()],
      build: {
        outDir: 'dist',
        rollupOptions: {
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        }
      },
      server: {
        port: 3000,
        host: '0.0.0.0'
      }
    };
  }

  // Worker build configuration (default)
  return {
    base: './',
    plugins: [pages(), react()],
    build: {
      outDir: 'dist',
      emptyOutDir: false
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  };
});
