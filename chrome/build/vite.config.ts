import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        const distDir = resolve(__dirname, '../dist');
        const iconsDir = resolve(distDir, 'icons');
        
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true });
        }
        
        copyFileSync(
          resolve(__dirname, '../manifest.json'),
          resolve(distDir, 'manifest.json')
        );
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    }
  },
  build: {
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, '../src/content/content.tsx'),
        popup: resolve(__dirname, '../src/popup/popup.html'),
        background: resolve(__dirname, '../src/background/background.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'content' ? 'content.js' : '[name].js';
        },
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'content.css') {
            return 'content.css';
          }
          if (assetInfo.name === 'popup.css') {
            return 'popup.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  }
});
