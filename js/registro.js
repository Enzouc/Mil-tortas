import { auth } from "./storage.js";
import { mostrarAlertaWeb } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario-registro");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreEl = document.getElementById("nombre");
    const correoEl = document.getElementById("email") || document.getElementById("correo");
    const passwordEl = document.getElementById("password");
    const codigoEl = document.getElementById("codigo-promocional");
    const fechaEl = document.getElementById("fecha-nacimiento");

    const nombre = nombreEl && "value" in nombreEl ? nombreEl.value.trim() : "";
    const correo = correoEl && "value" in correoEl ? correoEl.value.trim() : "";
    const password =
      passwordEl && "value" in passwordEl ? passwordEl.value.trim() : "";
    const codigoPromocional =
      codigoEl && "value" in codigoEl ? codigoEl.value.trim() : "";
    const fechaNacimiento =
      fechaEl && "value" in fechaEl ? fechaEl.value : "";

    if (!nombre || !correo || !password) {
      mostrarAlertaWeb("Debes completar nombre, correo y contraseña.");
      return;
    }

    const data = {
      nombre,
      apellido: "N/A",
      run: "00000000K",
      correo,
      password,
      region: "Metropolitana",
      comuna: "Santiago",
      direccion: "Pendiente",
      fechaNacimiento,
      codigoPromocional: codigoPromocional || null,
      rol: "CLIENTE",
    };

    try {
      const res = await auth.registerAndLogin(data);
      if (!res || !res.token) {
        mostrarAlertaWeb("No se pudo registrar el usuario.");
        return;
      }

      mostrarAlertaWeb("¡Registro exitoso y sesión iniciada!");

      setTimeout(() => {
        window.location.href = "/perfil.html";
      }, 1200);
    } catch (error) {
      mostrarAlertaWeb("Error durante el registro.");
      console.error(error);
    }
  });
});
