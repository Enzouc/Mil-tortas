import type { Producto } from './types';

export const productosData = {
  obtenerTodos(): Producto[] {
 
    return [
      {
        id: 'TC001',
        nombre: 'Torta Cuadrada de Chocolate',
        descripcion: 'Deliciosa torta de chocolate...',
        precio: 45000,
        categoria: 'Tortas Cuadradas',
        tipo: 'cuadrada',
        tamano: 'grande',
        imagen: 'https://...'
      },
      // ... más productos
    ];
  },


  obtenerPorId(id: string): Producto | undefined {
    return this.obtenerTodos().find(producto => producto.id === id);
  }
};

export const productos = {
  /**
   * @param {Producto[]} productosMostrar - 
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
            <p>${producto.descripcion}</p>
            <span class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</span>
            <input type="text" id="mensaje-${producto.id}" class="mensaje-personalizado" placeholder="Mensaje para la torta (opcional)">
            <button class="agregar-carrito-btn" data-id="${producto.id}">Agregar al Carrito</button>
        </div>
      `;
      grid.appendChild(productoElement);
    });
  },


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
