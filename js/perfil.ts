import { storage } from './storage'; 
import { mostrarAlertaWeb } from './app';
import type { Usuario } from './types';

export function inicializarPerfil(): void {
  const usuario = storage.obtenerUsuario();

  // Si no hay usuario guardado, redirige al registro
  if (!usuario) {
    window.location.href = 'registro.html';
    return;
  }

  // Elementos del DOM
  const nombreInput = document.getElementById('nombre') as HTMLInputElement | null;
  const emailInput = document.getElementById('email') as HTMLInputElement | null;
  const fechaInput = document.getElementById('fecha-nacimiento') as HTMLInputElement | null;
  const formulario = document.getElementById('formulario-actualizacion') as HTMLFormElement | null;
  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion') as HTMLButtonElement | null;

  // Rellena los datos actuales
  if (nombreInput) nombreInput.value = usuario.nombre || '';
  if (emailInput) emailInput.value = usuario.email || '';
  if (fechaInput) fechaInput.value = usuario.fechaNacimiento || '';

  // Marca las preferencias guardadas
  if (Array.isArray(usuario.preferencias)) {
    const checkboxes = document.querySelectorAll('input[name="preferencias"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      if (usuario.preferencias?.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }

  // Guardar cambios del perfil
  if (formulario) {
    formulario.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      
      const preferenciasSeleccionadas: string[] = [];
      const checkboxes = document.querySelectorAll('input[name="preferencias"]:checked') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(checkbox => preferenciasSeleccionadas.push(checkbox.value));

      const usuarioActualizado: Usuario = {
        ...usuario,
        nombre: nombreInput?.value || usuario.nombre,
        email: emailInput?.value || usuario.email,
        fechaNacimiento: fechaInput?.value || usuario.fechaNacimiento,
        preferencias: preferenciasSeleccionadas.length > 0 ? preferenciasSeleccionadas : [],
      };

      storage.guardarUsuario(usuarioActualizado);
      mostrarAlertaWeb('¡Perfil actualizado con éxito!');
    });
  }

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
      storage.limpiarUsuario();
      mostrarAlertaWeb('Has cerrado sesión.');
      window.location.href = 'index.html';
    });
  }
}
