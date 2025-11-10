import type { Producto } from './types';
import { mostrarAlertaWeb } from './app'; 

export const productosData = {
  /**
   * @returns {Producto[]}
   */
  obtenerTodos(): Producto[] {
    return [
      {
        id: 'TC001',
        nombre: 'Torta Cuadrada de Chocolate',
        descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.',
        precio: 45000,
        categoria: 'Tortas Cuadradas',
        tipo: 'cuadrada',
        tamano: 'grande',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTw4LCFBgOoVozVginkDI5-M8CXvhNzKYdxkK_8JcXDgTEF64xPtyRED9I6i7WGbFwFxg&usqp=CAU'
      },
      {
        id: 'TC002',
        nombre: 'Torta Cuadrada de Frutas',
        descripcion: 'Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.',
        precio: 50000,
        categoria: 'Tortas Cuadradas',
        tipo: 'cuadrada',
        tamano: 'grande',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQruPGpmGm6_S4sMSDalYfvmZT5gGwlfmicug&sgit '
      },
      {
        id: 'TT001',
        nombre: 'Torta Circular de Vainilla',
        descripcion: 'La clásica torta de vainilla con manjar y nueces. Un sabor tradicional que nunca falla.',
        precio: 35000,
        categoria: 'Tortas Circulares',
        tipo: 'circular',
        tamano: 'mediana',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR07w-K6hQ92f9k_gT2_Q0o3vVv9eJk4Z6-8A&usqp=CAU'
      },
      {
        id: 'TT002',
        nombre: 'Torta Circular de Lúcuma',
        descripcion: 'Exótica torta de lúcuma, manjar y crema. Un postre chileno imperdible y favorito del público.',
        precio: 48000,
        categoria: 'Tortas Circulares',
        tipo: 'circular',
        tamano: 'grande',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6Hq-Q9Z5Q-S2E-L4kY4v2gT-h8d2j8W0o-A&usqp=CAU'
      },
      {
        id: 'TL001',
        nombre: 'Cheesecake de Frambuesa',
        descripcion: 'Base de galleta, suave queso crema y cubierta con una mermelada de frambuesas casera.',
        precio: 28000,
        categoria: 'Tortas Ligth/Especiales',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7d2Y-rK6g4O5u1c7P3Fz4yJ9nQ7g2i6xQ9A&usqp=CAU'
      },
      {
        id: 'TL002',
        nombre: 'Torta Vegana de Zanahoria',
        descripcion: 'Torta de zanahoria sin lácteos ni huevos, glaseada con crema de castañas de cajú. Opción saludable y deliciosa.',
        precio: 38000,
        categoria: 'Tortas Ligth/Especiales',
        tipo: 'especial',
        tamano: 'mediana',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8pB-J1g4pWw7G3x-m-j5f6v4l7q8Y0q-gXQ&usqp=CAU'
      },
      {
        id: 'TM001',
        nombre: 'Pie de Limón Clásico',
        descripcion: 'Clásico Pie de Limón con una base crujiente y un merengue italiano suave y firme.',
        precio: 22000,
        categoria: 'Postres',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2j_2x9yL7v0n1v4j8j7w3z5w3j4o2z8w-gA&usqp=CAU'
      },
      {
        id: 'TM002',
        nombre: 'Tiramisú Tradicional',
        descripcion: 'Postre italiano con capas de bizcocho remojado en café y crema de mascarpone. No apto para menores.',
        precio: 32000,
        categoria: 'Postres',
        tipo: 'especial',
        tamano: 'mediana',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6A6R4f4X0g7z3y5K0z3u3J4w3g4x-J9K0zQ&usqp=CAU'
      },
      {
        id: 'TC003',
        nombre: 'Torta de Tres Leches',
        descripcion: 'Suave bizcocho de vainilla, empapado en una mezcla de tres leches y cubierto con merengue.',
        precio: 42000,
        categoria: 'Tortas Cuadradas',
        tipo: 'cuadrada',
        tamano: 'grande',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-2r5e3Fw7m4M3L6x8K0j8F1E7b4x4G0g-Q&usqp=CAU'
      },
      {
        id: 'TT003',
        nombre: 'Selva Negra',
        descripcion: 'Bizcocho de chocolate, cerezas y crema chantilly, con licor de cerezas. Clásico alemán.',
        precio: 55000,
        categoria: 'Tortas Circulares',
        tipo: 'circular',
        tamano: 'grande',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8k5F-5p4d6X8p4w3v-r-v4F4q4y3p6g-Q&usqp=CAU'
      }
    ];
  },


  /**
   * @param {string} id - El ID del producto a buscar.
   * @returns {Producto | undefined}
   */
  obtenerPorId(id: string): Producto | undefined {
    return this.obtenerTodos().find(producto => producto.id === id);
  }
};

export const productos = {
  /**
   * @param {Producto[]} productosMostrar - Array de productos a mostrar.
   */
  cargarProductos(productosMostrar: Producto[]): void {

    const grid = document.getElementById('productos-grid') as HTMLDivElement | null;
    if (!grid) return; 

    grid.innerHTML = '';

    if (productosMostrar.length === 0) {
      grid.innerHTML = '<p class="text-center">No se encontraron productos con esos filtros.</p>';
      return;
    }

    productosMostrar.forEach((producto: Producto) => {
      const productoElement = document.createElement('div');
      productoElement.classList.add('producto-card');

      const imagenProducto: string = producto.imagen || 'https://placehold.co/300x200/FFF5E1/5D4037?text=Mil+Sabores';

      productoElement.innerHTML = `
        <div class="producto-img">
            <img src="${imagenProducto}" alt="Imagen de ${producto.nombre}">
        </div>
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <div class="mensaje-personalizado">
                <label for="mensaje-${producto.id}">Mensaje personalizado:</label>
                <input type="text" id="mensaje-${producto.id}" maxlength="25" placeholder="Feliz cumpleaños, Te quiero, etc.">
            </div>
            <span class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</span>
            <button class="agregar-carrito-btn" data-id="${producto.id}">Agregar al Carrito</button>
        </div>
      `;
      grid.appendChild(productoElement);
    });
    
    
  },

  /**
   */
  filtrarProductos(): void {
    const activeCategoriaBtn = document.querySelector('.categoria-btn.active') as HTMLElement | null;
    const tamanoSelect = document.getElementById('filtro-tamano') as HTMLSelectElement | null;

    if (!activeCategoriaBtn || !tamanoSelect) {
      return; 
    }

    const categoriaSeleccionada: string = activeCategoriaBtn.dataset.categoria ?? 'todos';
    const tamanoSeleccionado: string = tamanoSelect.value;

    let productosFiltrados: Producto[] = productosData.obtenerTodos();

    if (categoriaSeleccionada !== 'todos') {
      productosFiltrados = productosFiltrados.filter((producto: Producto) => producto.categoria === categoriaSeleccionada);
    }

    if (tamanoSeleccionado !== 'todos') {
      productosFiltrados = productosFiltrados.filter((producto: Producto) => producto.tamano === tamanoSeleccionado);
    }

    this.cargarProductos(productosFiltrados);
  },

  /**
   */
  inicializarFiltros(): void {
    const categoriaBtns = document.querySelectorAll('.categoria-btn') as NodeListOf<HTMLElement>;
    categoriaBtns.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', (e: MouseEvent) => {
        categoriaBtns.forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active'); 
        this.filtrarProductos();
      });
    });

    const tamanoSelect = document.getElementById('filtro-tamano') as HTMLSelectElement | null;
    if (tamanoSelect) {
      tamanoSelect.addEventListener('change', () => {
        this.filtrarProductos();
      });
    }
  }
};