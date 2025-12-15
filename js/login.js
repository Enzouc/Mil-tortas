import { mostrarAlertaWeb } from "./app.js";
import { auth } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario-login");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correoEl = document.getElementById("correo");
    const passwordEl = document.getElementById("password");

    const correo = correoEl && "value" in correoEl ? correoEl.value.trim() : "";
    const password =
      passwordEl && "value" in passwordEl ? passwordEl.value.trim() : "";

    if (!correo || !password) {
      mostrarAlertaWeb("Debes ingresar correo y contraseña.");
      return;
    }

    try {
      const resultado = await auth.login(correo, password);

      if (!resultado || !resultado.token || !resultado.usuario) {
        mostrarAlertaWeb("Correo o contraseña incorrectos.");
        return;
      }

      if (resultado.usuario.activo === false) {
        mostrarAlertaWeb("Tu cuenta está deshabilitada. Contacta al administrador.");
        return;
      }

      const rol = resultado.usuario.rol;

      if (rol === "ADMIN") {
        window.location.href = "/admin.html";
      } else if (rol === "VENDEDOR") {
        window.location.href = "/vendedor.html";
      } else {
        window.location.href = "/perfil.html";
      }
    } catch (err) {
      mostrarAlertaWeb(err?.message || "Error iniciando sesión. Intenta nuevamente.");
      console.error(err);
    }
  });
});
