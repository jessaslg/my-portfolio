import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        minesweeper: resolve(__dirname, 'minesweeper.html'),
        popup: resolve(__dirname, 'popup_mock.html')
      }
    }
  },
  publicDir: 'public',
  base: '/'
});
