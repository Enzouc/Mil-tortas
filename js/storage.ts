import type { CarritoItem, Usuario } from './types';

export const storage = {
  /**
   * @returns {CarritoItem[]} 
   */
  obtenerCarrito(): CarritoItem[] {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
  },

  /**
   * @param {CarritoItem[]} carrito 
   */
  guardarCarrito(carrito: CarritoItem[]): void {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  },

  limpiarCarrito(): void {
    localStorage.removeItem('carrito');
  },

  /**
   
   * @returns {Usuario | null} 
   */
  obtenerUsuario(): Usuario | null {
    const usuarioJSON = localStorage.getItem('usuario');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
  },

  /**
   * @param {Usuario} usuario 
   */
  guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },

  limpiarUsuario(): void {
    localStorage.removeItem('usuario');
  }
};