import { auth } from "./storage.js";

export const validacion = {
  validationRules: [
    {
      id: "nombre",
      errorId: "nombre",
      validations: [
        { check: (value) => !value.trim(), message: "El nombre es obligatorio" },
        { check: (value) => value.trim().length < 3, message: "Mínimo 3 caracteres" },
      ],
    },
    {
      id: "email",
      errorId: "email",
      validations: [
        { check: (value) => !value.trim(), message: "El email es obligatorio" },
        {
          check: (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: "El formato del email no es válido",
        },
      ],
    },
    {
      id: "fecha-nacimiento",
      errorId: "fecha",
      validations: [
        { check: (value) => !value, message: "La fecha de nacimiento es obligatoria" },
        {
          check: (value) => {
            const fecha = new Date(value);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fecha.getFullYear();
            const mes = hoy.getMonth() - fecha.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
              edad--;
            }
            return edad < 18;
          },
          message: "Debes ser mayor de 18 años para registrarte",
        },
      ],
    },
    {
      id: "password",
      errorId: "password",
      validations: [
        { check: (value) => !value, message: "La contraseña es obligatoria" },
        { check: (value) => value.length < 6, message: "La contraseña debe tener al menos 6 caracteres" },
      ],
    },
    {
      id: "codigo-promocional",
      errorId: "codigo",
      validations: [
        {
          check: (value) => value && value.toUpperCase() !== "FELICES50",
          message: "El código promocional no es válido",
        },
      ],
    },
  ],

  async validarFormularioRegistro(e) {
    e.preventDefault();
    let esFormularioValido = true;

    this.validationRules.forEach((rule) => {
      const inputElement = document.getElementById(rule.id);
      if (!inputElement || !("value" in inputElement)) return;

      let errorMessage = "";
      for (const validation of rule.validations) {
        if (validation.check(inputElement.value)) {
          errorMessage = validation.message;
          break;
        }
      }

      if (errorMessage) {
        this.mostrarError(rule.errorId, errorMessage);
        esFormularioValido = false;
      } else {
        this.limpiarError(rule.errorId);
      }
    });

    if (esFormularioValido) {
      const nombre = (document.getElementById("nombre") || {}).value || "";
      const email = (document.getElementById("email") || {}).value || "";
      const fechaNacimiento =
        (document.getElementById("fecha-nacimiento") || {}).value || "";
      const password = (document.getElementById("password") || {}).value || "";
      const codigoPromocional =
        (document.getElementById("codigo-promocional") || {}).value || "";

      try {
        const resultado = await auth.registerAndLogin({
          nombre,
          apellido: "N/A",
          run: "00000000K",
          correo: email,
          password,
          region: "Metropolitana",
          comuna: "Santiago",
          direccion: "Pendiente",
          fechaNacimiento,
          codigoPromocional: codigoPromocional || null,
          rol: "CLIENTE",
        });

        if (!resultado || !resultado.token) {
          this.mostrarAlerta("Error en el registro");
          return;
        }

        this.mostrarAlerta("Registro exitoso. Redirigiendo...");
        setTimeout(() => (window.location.href = "login.html"), 1500);
      } catch (err) {
        this.mostrarAlerta("Error: " + err.message);
      }
    }
  },

  mostrarError(campo, mensaje) {
    const errorElement = document.getElementById(`error-${campo}`);
    if (errorElement) {
      errorElement.textContent = mensaje;
    }
  },

  limpiarError(campo) {
    const errorElement = document.getElementById(`error-${campo}`);
    if (errorElement) {
      errorElement.textContent = "";
    }
  },

  mostrarAlerta(mensaje) {
    const modal = document.getElementById("modal-alerta");
    const texto = document.getElementById("modal-mensaje");
    const cerrarBtn = document.getElementById("modal-cerrar");
    if (modal && texto && cerrarBtn) {
      texto.textContent = mensaje;
      modal.classList.add("visible");
      cerrarBtn.onclick = () => modal.classList.remove("visible");
    } else {
      alert(mensaje);
    }
  },

  inicializar() {
    const formularioRegistro = document.getElementById("formulario-registro");
    if (formularioRegistro) {
      formularioRegistro.addEventListener("submit", (e) =>
        this.validarFormularioRegistro(e)
      );
    }
  },
};
