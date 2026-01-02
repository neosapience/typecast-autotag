import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      'typecast-autotag/english': path.resolve(__dirname, '../src/english'),
      'typecast-autotag': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
