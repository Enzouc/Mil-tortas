import type { Producto } from './types';
import { mostrarAlertaWeb } from './app';
import { carrito } from './carrito';


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
        descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.',
        precio: 40000,
        categoria: 'Tortas Circulares',
        tipo: 'circular',
        tamano: 'mediana',
        imagen: 'https://tortamaniaecuador.com/wp-content/uploads/2021/12/Tradicional-de-vainilla-300x300.png'
      },
      {
        id: 'TT002',
        nombre: 'Torta Circular de Manjar',
        descripcion: 'Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.',
        precio: 42000,
        categoria: 'Tortas Circulares',
        tipo: 'circular',
        tamano: 'mediana',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThvi3_VP-zWyB1BlW46XHAXFR2OQerKahW_Q&s'
      },
      {
        id: 'PI001',
        nombre: 'Mousse de Chocolate',
        descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.',
        precio: 5000,
        categoria: 'Postres Individuales',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://www.bonella.com.ec/-/media/Project/Upfield/Brands/Rama/Rama-EC/Assets/Recipes/sync-img/d65034c7-c31d-4d41-8ffd-80fcffa0f254.jpg?rev=2d3b42b7082e4be48a0448d611c08566'
      },
      {
        id: 'PI002',
        nombre: 'Tiramisú Clásico',
        descripcion: 'Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.',
        precio: 5500,
        categoria: 'Postres Individuales',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://www.bettycrocker.lat/wp-content/uploads/2021/04/BCL-Tiramisu_Recipe_770x514.jpg'
      },
      {
        id: 'PSA001',
        nombre: 'Torta Sin Azúcar de Naranja',
        descripcion: 'Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.',
        precio: 48000,
        categoria: 'Productos Sin Azúcar',
        tipo: 'circular',
        tamano: 'mediana',
        imagen: 'https://content-cocina.lecturas.com/medio/2024/02/12/pastel_de_naranja_sin_harina_00000000_240212030100_1200x1200.jpg'
      },
      {
        id: 'PSA002',
        nombre: 'Cheesecake Sin Azúcar',
        descripcion: 'Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.',
        precio: 47000,
        categoria: 'Productos Sin Azúcar',
        tipo: 'circular',
        tamano: 'pequeña',
        imagen: 'https://www.paulinacocina.net/wp-content/uploads/2025/01/receta-de-cheesecake-1742898428.jpg'
      },
      {
        id: 'PT001',
        nombre: 'Empanada de Manzana',
        descripcion: 'Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.',
        precio: 3000,
        categoria: 'Pastelería Tradicional',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://i.ytimg.com/vi/wToDEKvL-NM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD3v4UgMlXYsOcaG_3lWnC9kB0qGw'
      },
      {
        id: 'PT002',
        nombre: 'Tarta de Santiago',
        descripcion: 'Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.',
        precio: 6000,
        categoria: 'Pastelería Tradicional',
        tipo: 'circular',
        tamano: 'pequeña',
        imagen: 'https://recipesblob.oetker.es/assets/c104e75b79384f3b94873bd15cdfe66c/1272x764/tarta-de-santiago.webp'
      },
      {
        id: 'PG001',
        nombre: 'Brownie Sin Gluten',
        descripcion: 'Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.',
        precio: 4000,
        categoria: 'Productos sin gluten',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://content.cuerpomente.com/medio/2023/05/04/brownie-recetas-saludables_6e41a648_230504111738_1280x720.jpg'
      },
      {
        id: 'PG002',
        nombre: 'Pan Sin Gluten',
        descripcion: 'Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.',
        precio: 3500,
        categoria: 'Productos sin gluten',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJs2H6vRQ9wu4Kq0qlrkK1C15BWFQpI4ymsA&s'
      },
      {
        id: 'PV001',
        nombre: 'Torta Vegana de Chocolate',
        descripcion: 'Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.',
        precio: 50000,
        categoria: 'Productos Vegana',
        tipo: 'circular',
        tamano: 'grande',
        imagen: 'https://happyvegannie.com/wp-content/uploads/2022/01/blog-img-6234-web.jpg'
      },
      {
        id: 'PV002',
        nombre: 'Galletas Veganas de Avena',
        descripcion: 'Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.',
        precio: 4500,
        categoria: 'Productos Vegana',
        tipo: 'especial',
        tamano: 'pequeña',
        imagen: 'https://delantaldealces.com/wp-content/uploads/2016/01/galletas-avena-veganas-3.jpg'
      },
      {
        id: 'TE001',
        nombre: 'Torta Especial de Cumpleaños',
        descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.',
        precio: 55000,
        categoria: 'Tortas Especiales',
        tipo: 'circular',
        tamano: 'grande',
        imagen: 'https://www.ferrerorocher.com/ar/sites/ferrerorocher20_ar/files/2021-05/birthday-cake_0.jpeg?t=1750438253'
      },
      {
        id: 'TE002',
        nombre: 'Torta Especial de Boda',
        descripcion: 'Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.',
        precio: 60000,
        categoria: 'Tortas Especiales',
        tipo: 'cuadrada',
        tamano: 'grande',
        imagen: 'https://i.pinimg.com/736x/e1/0f/91/e10f9182247c8f5ccb47ab32acc62d92.jpg'
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
   * @param {string} id -
   * @returns {Producto | undefined}
   */
   obtenerPorId(id: string): Producto | undefined {
    return this.obtenerTodos().find(p => p.id === id);
  }
};



export const productos = {

  cargarProductos(productosMostrar: Producto[]): void {
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


  filtrarProductos(): void {
    const categoriaActiva = document.querySelector('.categoria-btn.active') as HTMLElement | null;
    const tamanoActivo = document.querySelector('.tamano-btn.active') as HTMLElement | null;

    if (!categoriaActiva || !tamanoActivo) return;

    const categoria = categoriaActiva.dataset.categoria ?? 'todos';
    const tamano = tamanoActivo.dataset.tamano ?? 'todos';

    let filtrados = productosData.obtenerTodos();

    if (categoria !== 'todos') {
      filtrados = filtrados.filter(p => p.categoria === categoria);
    }

    if (tamano !== 'todos') {
      filtrados = filtrados.filter(p => p.tamano === tamano);
    }

    this.cargarProductos(filtrados);
  },



  inicializarBotones(): void {
    const categoriaBtns = document.querySelectorAll('.categoria-btn') as NodeListOf<HTMLElement>;
    categoriaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoriaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filtrarProductos();
      });
    });


    const tamanoBtns = document.querySelectorAll('.tamano-btn') as NodeListOf<HTMLElement>;
    tamanoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tamanoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filtrarProductos();
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

  carrito.agregarAlCarrito(
    productoSeleccionado.id,
    mensajeInput.value.trim(),
    Number(cantInput.value)
  );

  cerrarModal();
});

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.closest(".producto-img") || target.classList.contains("ver-mas-btn")) {
    const id = target.closest("[data-id]")?.getAttribute("data-id");
    if (id) {
      const producto = productosData.obtenerPorId(id);
      if (producto) abrirModal(producto);
    }
  }
});