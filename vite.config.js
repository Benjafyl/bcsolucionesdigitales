import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        problemas: resolve(__dirname, 'problemas.html'),
        propuesta: resolve(__dirname, 'propuesta.html'),
        servicios: resolve(__dirname, 'servicios.html'),
      },
    },
  },
});
