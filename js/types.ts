export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  tipo: 'cuadrada' | 'circular' | 'especial';
  tamano: 'grande' | 'mediana' | 'pequeña';
  imagen: string;
}

export interface CarritoItem extends Producto {
  cantidad: number;
  mensaje: string;
}

export interface Usuario {
  nombre: string;
  email: string;
  fechaNacimiento: string;
  codigoPromocional?: string;
  preferencias?: string[]; 
}


export interface Pedido {
  id: string;
  fecha: string;
  productos: CarritoItem[];
  total: number;
  estado: 'pendiente' | 'en preparación' | 'entregado' | 'cancelado';
}
