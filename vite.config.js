import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        productos: resolve(__dirname, 'productos.html'),
        carrito: resolve(__dirname, 'carrito.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        perfil: resolve(__dirname, 'perfil.html'),
        registro: resolve(__dirname, 'registro.html'),
      },
    },
  },
});