import { storage } from './storage';
import { mostrarAlertaWeb } from './app';
import type { Usuario } from './types';

interface ValidationRule {
  id: string;
  errorId: string;
  validations: {
    check: (value: string) => boolean;
    message: string;
  }[];
}

export const validacion = {
  validationRules: [
    {
      id: 'nombre',
      errorId: 'nombre',
      validations: [
        { check: (value: string) => !value.trim(), message: 'El nombre es obligatorio' }
      ]
    },
    {
      id: 'email',
      errorId: 'email',
      validations: [
        { check: (value: string) => !value.trim(), message: 'El email es obligatorio' },
        { check: (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'El formato del email no es válido' }
      ]
    },
    {
      id: 'fecha-nacimiento',
      errorId: 'fecha',
      validations: [
        { check: (value: string) => !value, message: 'La fecha de nacimiento es obligatoria' },
        {
          check: (value: string) => {
            const fecha = new Date(value);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fecha.getFullYear();
            const mes = hoy.getMonth() - fecha.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
              edad--;
            }
            return edad < 18;
          },
          message: 'Debes ser mayor de 18 años para registrarte'
        }
      ]
    },
    {
      id: 'password',
      errorId: 'password',
      validations: [
        { check: (value: string) => !value, message: 'La contraseña es obligatoria' },
        { check: (value: string) => value.length < 6, message: 'La contraseña debe tener al menos 6 caracteres' }
      ]
    },
    {
      id: 'codigo-promocional',
      errorId: 'codigo',
      validations: [
        { check: (value: string) => value && value.toUpperCase() !== 'FELICES50', message: 'El código promocional no es válido' }
      ]
    }
  ] as ValidationRule[], 
  /**
   * @param {Event} e 
   */
  validarFormularioRegistro(e: Event): void {
    e.preventDefault();
    let esFormularioValido = true;

    this.validationRules.forEach(rule => {
      const inputElement = document.getElementById(rule.id) as HTMLInputElement | null;
      if (!inputElement) return;

      let errorMessage = '';
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
      const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
      const email = (document.getElementById('email') as HTMLInputElement).value.trim();
      const fechaNacimiento = (document.getElementById('fecha-nacimiento') as HTMLInputElement).value;
      const codigoPromocional = (document.getElementById('codigo-promocional') as HTMLInputElement).value.trim().toUpperCase();

      const nuevoUsuario: Usuario = { nombre, email, fechaNacimiento, codigoPromocional };

      storage.guardarUsuario(nuevoUsuario);
      mostrarAlertaWeb('¡Registro exitoso! Serás dirigido a tu perfil.');
      this.aplicarDescuentos(email, new Date(fechaNacimiento), codigoPromocional);

      (e.target as HTMLFormElement).reset();
      window.location.href = 'perfil.html';
    }
  },


  aplicarDescuentos(email: string, fechaNacimiento: Date, codigoPromocional: string): void {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    const mensajes: string[] = [];
    if (edad >= 50) {
      mensajes.push('¡Felicidades! Obtienes un 50% de descuento por ser mayor de 50 años.');
    }
    if (codigoPromocional === 'FELICES50') {
      mensajes.push('¡Felicidades! Obtienes un 10% de descuento de por vida con el código FELICES50.');
    }
    if (email.endsWith('@duocuc.cl')) {
      mensajes.push('¡Felicidades! Por ser de Duoc UC, recibirás una torta gratis en tu cumpleaños.');
    }

    if (mensajes.length > 0) {
      mostrarAlertaWeb(mensajes.join('\n\n'));
    }
  },

  mostrarError(campo: string, mensaje: string): void {
    const errorElement = document.getElementById(`error-${campo}`) as HTMLSpanElement | null;
    if (errorElement) {
      errorElement.textContent = mensaje;
    }
  },

  limpiarError(campo: string): void {
    const errorElement = document.getElementById(`error-${campo}`) as HTMLSpanElement | null;
    if (errorElement) {
      errorElement.textContent = '';
    }
  },


  inicializar(): void {
    const formularioRegistro = document.getElementById('formulario-registro') as HTMLFormElement | null;
    if (formularioRegistro) {
      formularioRegistro.addEventListener('submit', (e: Event) => this.validarFormularioRegistro(e));
    }
  }
};

