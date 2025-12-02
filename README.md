# Mil-tortas

## Cómo iniciar el front con Vite y entrar como admin

1. Instala dependencias en el proyecto raíz:
   ```bash
   npm install
   ```
2. Arranca el back-end en `http://localhost:8080` para que la API de autenticación y productos responda.
3. En otra terminal, levanta el front-end con Vite:
   ```bash
   npm run dev
   ```
4. Abre la ruta de login (por defecto `http://localhost:5173/login.html`).
5. Inicia sesión con un usuario que tenga `rol` igual a `ADMIN`. El flujo de `login.ts` guarda el token y el usuario en `localStorage`, y si el rol es admin redirige a `admin.html`. El archivo `admin.ts` valida el rol antes de mostrar el panel y vuelve a `login.html` si no es admin.

La configuración de Vite ya incluye `login.html` y `admin.html` como entradas para que el CSS existente se procese sin cambios en el build.
