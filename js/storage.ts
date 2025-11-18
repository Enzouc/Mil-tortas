import type { CarritoItem, Usuario, Pedido } from './types';

export const storage = {

  obtenerCarrito(): CarritoItem[] {
    try {
      const carritoJSON = localStorage.getItem('carrito');
      return carritoJSON ? JSON.parse(carritoJSON) : [];
    } catch {
      console.error('Error al leer el carrito del almacenamiento.');
      return [];
    }
  },

 
  guardarCarrito(carrito: CarritoItem[]): void {
    try {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch {
      console.error('Error al guardar el carrito en el almacenamiento.');
    }
  },


  limpiarCarrito(): void {
    localStorage.removeItem('carrito');
  },


  obtenerUsuario(): Usuario | null {
    try {
      const usuarioJSON = localStorage.getItem('usuario');
      const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
      if (usuario && !Array.isArray(usuario.preferencias)) {
        usuario.preferencias = [];
      }
      return usuario;
    } catch {
      console.error('Error al leer el usuario del almacenamiento.');
      return null;
    }
  },


  guardarUsuario(usuario: Usuario): void {
    try {
      const usuarioSeguro: Usuario = {
        ...usuario,
        preferencias: Array.isArray(usuario.preferencias)
          ? usuario.preferencias
          : [],
      };
      localStorage.setItem('usuario', JSON.stringify(usuarioSeguro));
    } catch {
      console.error('Error al guardar el usuario en el almacenamiento.');
    }
  },


  limpiarUsuario(): void {
    localStorage.removeItem('usuario');
  },
};


export const storagePedidos = {
 
  obtenerPedidos(): Pedido[] {
    try {
      const pedidosJSON = localStorage.getItem('pedidos');
      return pedidosJSON ? JSON.parse(pedidosJSON) : [];
    } catch {
      console.error('Error al leer los pedidos del almacenamiento.');
      return [];
    }
  },

  
  guardarPedidos(pedidos: Pedido[]): void {
    try {
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
    } catch {
      console.error('Error al guardar los pedidos en el almacenamiento.');
    }
  },

 
  agregarPedido(nuevoPedido: Pedido): void {
    try {
      const pedidos = this.obtenerPedidos();
      pedidos.push(nuevoPedido);
      this.guardarPedidos(pedidos);
    } catch {
      console.error('Error al agregar un nuevo pedido.');
    }
  },

  
  limpiarPedidos(): void {
    localStorage.removeItem('pedidos');
  },
};
