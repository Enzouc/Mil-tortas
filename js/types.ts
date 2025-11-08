
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  tipo: 'cuadrada' | 'circular' | 'personalizada'; // Tipos de torta
  tamano: 'grande' | 'mediano' | 'pequeno'; // Tamaños
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