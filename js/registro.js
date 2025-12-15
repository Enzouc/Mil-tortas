import { auth } from "./storage.js";
import { mostrarAlertaWeb } from "./app.js";

let regiones = {};

async function cargarRegionesDesdeApi() {
  const resp = await fetch("http://localhost:8080/api/regiones");
  if (!resp.ok) throw new Error("No se pudieron cargar regiones");
  regiones = await resp.json();
}

// Dominios permitidos y validación mínima de correo
const dominiosPermitidos = /^[^@\s]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

function poblarRegiones(regionSelect) {
  const options = ['<option value="">Selecciona una region</option>']
    .concat(Object.keys(regiones).map((r) => `<option value="${r}">${r}</option>`));
  regionSelect.innerHTML = options.join("");
}

function poblarComunas(regionSelect, comunaSelect) {
  const region = regionSelect.value;
  const comunas = regiones[region] || [];
  const options = ['<option value="">Selecciona una comuna</option>']
    .concat(comunas.map((c) => `<option value="${c}">${c}</option>`));
  comunaSelect.innerHTML = options.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario-registro");
  if (!form) return;

  const runEl = document.getElementById("run");
  const nombreEl = document.getElementById("nombre");
  const apellidoEl = document.getElementById("apellido");
  const correoEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const codigoEl = document.getElementById("codigo-promocional");
  const fechaEl = document.getElementById("fecha-nacimiento");
  const regionEl = document.getElementById("region");
  const comunaEl = document.getElementById("comuna");
  const direccionEl = document.getElementById("direccion");

  if (regionEl && comunaEl) {
    cargarRegionesDesdeApi()
      .then(() => {
        poblarRegiones(regionEl);
        regionEl.addEventListener("change", () => poblarComunas(regionEl, comunaEl));
      })
      .catch((e) => {
        console.error("No se pudieron cargar regiones desde el backend", e);
        mostrarAlertaWeb("Error al cargar regiones. Intenta mas tarde.");
      });
  }

  const limpiarErrores = () => {
    document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarErrores();

    const run = runEl.value.replace(/\D/g, "").trim();
    const nombre = nombreEl.value.trim();
    const apellido = apellidoEl.value.trim();
    const correo = correoEl.value.trim();
    const password = passwordEl.value.trim();
    const codigoPromocional = codigoEl.value.trim();
    const fechaNacimiento = fechaEl.value;
    const region = regionEl.value;
    const comuna = comunaEl.value;
    const direccion = direccionEl.value.trim();

    let esValido = true;

    // Solo validar largo mínimo (sin dígito verificador ni formato complejo)
    if (!run || run.length < 7) {
      document.getElementById("error-run").textContent = "RUN inválido (mínimo 7 dígitos).";
      esValido = false;
    }

    if (!nombre || nombre.length > 50) {
      document.getElementById("error-nombre").textContent = "Nombre requerido (max 50).";
      esValido = false;
    }

    if (!apellido || apellido.length > 100) {
      document.getElementById("error-apellido").textContent = "Apellidos requeridos (max 100).";
      esValido = false;
    }

    if (!correo || correo.length > 100 || !dominiosPermitidos.test(correo)) {
      document.getElementById("error-email").textContent = "Correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.";
      esValido = false;
    }

    if (direccion.length === 0 || direccion.length > 300) {
      document.getElementById("error-direccion").textContent = "Direccion requerida (max 300).";
      esValido = false;
    }

    if (!region) {
      document.getElementById("error-region").textContent = "Selecciona una region.";
      esValido = false;
    }

    if (!comuna) {
      document.getElementById("error-comuna").textContent = "Selecciona una comuna.";
      esValido = false;
    }

    if (!password || password.length < 6) {
      document.getElementById("error-password").textContent = "Contrasena minima de 6 caracteres.";
      esValido = false;
    }

    if (!esValido) {
      mostrarAlertaWeb("Revisa los campos marcados en rojo.");
      return;
    }

    const data = {
      run,
      nombre,
      apellido,
      correo,
      password,
      region,
      comuna,
      direccion,
      fechaNacimiento: fechaNacimiento || null,
      codigoPromocional: codigoPromocional || null,
      rol: "CLIENTE",
    };

    try {
      const res = await auth.registerAndLogin(data);
      if (!res || !res.token) {
        mostrarAlertaWeb("No se pudo registrar el usuario.");
        return;
      }

      mostrarAlertaWeb("Registro exitoso y sesion iniciada.");
      setTimeout(() => {
        window.location.href = "/perfil.html";
      }, 800);
    } catch (error) {
      mostrarAlertaWeb("Error durante el registro.");
      console.error(error);
    }
  });
});
