import type { Producto } from './types';
import { carrito } from './carrito';
import { productosApi } from './storage';

let productosCache: Producto[] = [];

async function obtenerProductosDesdeBackend(): Promise<Producto[]> {
  if (productosCache.length > 0) {
    return productosCache;
  }

  try {
    productosCache = await productosApi.obtenerTodos();
  } catch (error) {
    console.error('No se pudieron cargar los productos desde el backend.', error);
    productosCache = [];
  }

  return productosCache;
}

export const productosData = {
  async obtenerTodos(): Promise<Producto[]> {
    return obtenerProductosDesdeBackend();
  },

  async obtenerPorId(id: string): Promise<Producto | undefined> {
    const productos = await obtenerProductosDesdeBackend();
    return productos.find(p => p.id === id);
  }
};

export const productos = {

  async cargarProductos(productosMostrar: Producto[]): Promise<void> {
    const grid = document.getElementById('productos-grid') as HTMLDivElement | null;
    if (!grid) return;

    grid.innerHTML = '';

    if (productosMostrar.length === 0) {
      grid.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
      return;
    }

    productosMostrar.forEach((producto: Producto) => {
      const card = document.createElement('div');
      card.classList.add('producto-card');

      const imagenProducto = producto.imagen || 'https://placehold.co/300x200';

      card.innerHTML = `
        <div class="producto-img" data-id="${producto.id}">
            <img src="${imagenProducto}" alt="${producto.nombre}">
        </div>

        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion.substring(0, 70)}...</p>

            <span class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</span>

            <button class="ver-mas-btn" data-id="${producto.id}">
                Ver más
            </button>
        </div>
      `;

      grid.appendChild(card);
    });
  },


  async filtrarProductos(): Promise<void> {
    const categoriaActiva = document.querySelector('.categoria-btn.active') as HTMLElement | null;
    const tamanoActivo = document.querySelector('.tamano-btn.active') as HTMLElement | null;

    if (!categoriaActiva || !tamanoActivo) return;

    const categoria = categoriaActiva.dataset.categoria ?? 'todos';
    const tamano = tamanoActivo.dataset.tamano ?? 'todos';

    let filtrados = await productosData.obtenerTodos();

    if (categoria !== 'todos') {
      filtrados = filtrados.filter(p => p.categoria === categoria);
    }

    if (tamano !== 'todos') {
      filtrados = filtrados.filter(p => p.tamano === tamano);
    }

    await this.cargarProductos(filtrados);
  },



  inicializarBotones(): void {
    const categoriaBtns = document.querySelectorAll('.categoria-btn') as NodeListOf<HTMLElement>;
    categoriaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoriaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        void this.filtrarProductos();
      });
    });


    const tamanoBtns = document.querySelectorAll('.tamano-btn') as NodeListOf<HTMLElement>;
    tamanoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tamanoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        void this.filtrarProductos();
      });
    });
  }
};



const modal = document.getElementById("producto-modal") as HTMLDivElement;
const modalCerrar = document.getElementById("modal-cerrar") as HTMLElement;
const modalImg = document.getElementById("modal-imagen") as HTMLImageElement;
const modalNombre = document.getElementById("modal-nombre") as HTMLElement;
const modalDescripcion = document.getElementById("modal-descripcion") as HTMLElement;
const modalPrecio = document.getElementById("modal-precio") as HTMLElement;

const cantMenos = document.getElementById("cantidad-menos") as HTMLButtonElement;
const cantMas = document.getElementById("cantidad-mas") as HTMLButtonElement;
const cantInput = document.getElementById("cantidad-input") as HTMLInputElement;

const mensajeInput = document.getElementById("modal-mensaje-input") as HTMLInputElement;
const btnAgregar = document.getElementById("modal-agregar") as HTMLButtonElement;

let productoSeleccionado: Producto | null = null;

function abrirModal(producto: Producto) {
  productoSeleccionado = producto;

  modalImg.src = producto.imagen;
  modalNombre.textContent = producto.nombre;
  modalDescripcion.textContent = producto.descripcion;
  modalPrecio.textContent = "$" + producto.precio.toLocaleString("es-CL");

  cantInput.value = "1";
  mensajeInput.value = "";

  modal.classList.remove("hidden");
}

function cerrarModal() {
  modal.classList.add("hidden");
}

modalCerrar.addEventListener("click", cerrarModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});

cantMenos.addEventListener("click", () => {
  const value = Math.max(1, Number(cantInput.value) - 1);
  cantInput.value = value.toString();
});

cantMas.addEventListener("click", () => {
  cantInput.value = (Number(cantInput.value) + 1).toString();
});

btnAgregar.addEventListener("click", () => {
  if (!productoSeleccionado) return;

  void carrito.agregarAlCarrito(
    productoSeleccionado.id,
    mensajeInput.value.trim(),
    Number(cantInput.value)
  );

  cerrarModal();
});

document.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;

  if (target.closest(".producto-img") || target.classList.contains("ver-mas-btn")) {
    const id = target.closest("[data-id]")?.getAttribute("data-id");
    if (id) {
      const producto = await productosData.obtenerPorId(id);
      if (producto) abrirModal(producto);
    }
  }
});
