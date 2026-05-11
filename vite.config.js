import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        problemas: resolve(__dirname, 'problemas.html'),
        propuesta: resolve(__dirname, 'propuesta.html'),
        serviciosLegacy: resolve(__dirname, 'servicios.html'),
        servicios: resolve(__dirname, 'servicios/index.html'),
        proceso: resolve(__dirname, 'proceso/index.html'),
        preguntasFrecuentes: resolve(__dirname, 'preguntas-frecuentes/index.html'),
        contacto: resolve(__dirname, 'contacto/index.html'),
      },
    },
  },
});
