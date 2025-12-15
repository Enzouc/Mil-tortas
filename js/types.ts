export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  tipo?: string;
  tamano: string;
  imagen: string;
}

export interface CarritoItem extends Producto {
  cantidad: number;
  mensaje: string;
}

export interface Usuario {
  id?: string;
  nombre: string;
  correo: string;
  fechaNacimiento: string;
  codigoPromocional?: string;
  preferencias?: string[];
  rol: "ADMIN" | "CLIENTE";
}

export interface Pedido {
  id: string;
  fecha: string;
  productos: CarritoItem[];
  total: number;
  estado: 'pendiente' | 'en preparacion' | 'entregado' | 'cancelado';
}
