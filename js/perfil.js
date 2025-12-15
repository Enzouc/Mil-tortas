import { storage } from "./storage.js";
import { mostrarAlertaWeb } from "./app.js";

export async function inicializarPerfil() {
  const usuario = await storage.obtenerUsuario();

  if (!usuario) {
    window.location.href = "registro.html";
    return;
  }

  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const apellidoInput = document.getElementById("apellido");
  const fechaInput = document.getElementById("fecha-nacimiento");
  const formulario = document.getElementById("formulario-actualizacion");
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

  if (nombreInput && "value" in nombreInput) nombreInput.value = usuario.nombre || "";
  if (emailInput && "value" in emailInput) emailInput.value = usuario.correo || "";
  if (apellidoInput && "value" in apellidoInput) apellidoInput.value = usuario.apellido || usuario.apellidos || "";
  if (fechaInput && "value" in fechaInput) fechaInput.value = usuario.fechaNacimiento || "";

  if (Array.isArray(usuario.preferencias)) {
    const checkboxes = document.querySelectorAll('input[name="preferencias"]');
    checkboxes.forEach((checkbox) => {
      if ("value" in checkbox && usuario.preferencias?.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }

  if (formulario) {
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      const preferenciasSeleccionadas = [];
      const checkboxes = document.querySelectorAll('input[name="preferencias"]:checked');
      checkboxes.forEach((checkbox) => preferenciasSeleccionadas.push(checkbox.value));

      const usuarioActualizado = {
        ...usuario,
        nombre: nombreInput && "value" in nombreInput ? nombreInput.value : usuario.nombre,
        apellido: apellidoInput && "value" in apellidoInput ? apellidoInput.value : usuario.apellido,
        correo: emailInput && "value" in emailInput ? emailInput.value : usuario.correo,
        fechaNacimiento:
          fechaInput && "value" in fechaInput ? fechaInput.value : usuario.fechaNacimiento,
        preferencias: preferenciasSeleccionadas,
      };

      try {
        await storage.guardarUsuario(usuarioActualizado, true);
        mostrarAlertaWeb("Perfil actualizado con éxito!");
      } catch (error) {
        console.error("No se pudo actualizar el perfil en el backend.", error);
        mostrarAlertaWeb("No se pudo actualizar tu perfil. Intenta nuevamente.");
      }
    });
  }

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      storage.limpiarUsuario();
      mostrarAlertaWeb("Has cerrado sesión.");
      window.location.href = "index.html";
    });
  }
}
