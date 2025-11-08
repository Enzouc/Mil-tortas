
import { storage } from './storage';
import { productosData } from './productos';
import { mostrarAlertaWeb } from './app'; 
import type { CarritoItem, Producto } from './types';

export function actualizarContadorCarrito(): void {
  const contador = document.getElementById('contador-carrito') as HTMLSpanElement | null;
  if (contador) {
    const carritoActual = storage.obtenerCarrito();
    const cantidadTotal = carritoActual.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = String(cantidadTotal);
  }
}

export const carrito = {
  /**
   * @param {string} id 
   * @param {string} [mensaje=''] 
   */
  agregarAlCarrito(id: string, mensaje: string = ''): void {
    const producto = productosData.obtenerPorId(id);
    if (!producto) return;

    let carritoActual = storage.obtenerCarrito();
    const productoEnCarrito = carritoActual.find(item => item.id === id && item.mensaje === mensaje);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      const nuevoItem: CarritoItem = {
        ...producto,
        cantidad: 1,
        mensaje: mensaje
      };
      carritoActual.push(nuevoItem);
    }

    storage.guardarCarrito(carritoActual);
    actualizarContadorCarrito();
    mostrarAlertaWeb(`¡${producto.nombre} fue agregado al carrito!`);
  },

  /**
   * @param {string} id - 
   */
  eliminarDelCarrito(id: string): void {
    let carritoActual = storage.obtenerCarrito();
    carritoActual = carritoActual.filter(item => item.id !== id);
    storage.guardarCarrito(carritoActual);
    this.actualizarVistaCarrito();
    actualizarContadorCarrito();
  },

  /**
   * @param {string} id 
   * @param {number} nuevaCantidad 
   */
  actualizarCantidad(id: string, nuevaCantidad: number): void {
    if (nuevaCantidad < 1) {
      // Si la cantidad es 0 o menos, eliminamos el item
      this.eliminarDelCarrito(id);
      return;
    }
    let carritoActual = storage.obtenerCarrito();
    const producto = carritoActual.find(item => item.id === id);
    if (producto) {
      producto.cantidad = nuevaCantidad;
      storage.guardarCarrito(carritoActual);
      this.actualizarVistaCarrito();
      actualizarContadorCarrito();
    }
  },


  actualizarVistaCarrito(): void {
    const carritoItemsContainer = document.getElementById('carrito-items') as HTMLDivElement | null;
    const totalPrecioEl = document.getElementById('total-precio') as HTMLSpanElement | null;

    if (!carritoItemsContainer) return; 

    const carritoActual = storage.obtenerCarrito();
    let total = 0;
    carritoItemsContainer.innerHTML = '';

    if (carritoActual.length === 0) {
      carritoItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
      if (totalPrecioEl) {
        totalPrecioEl.textContent = `$0`;
      }
      return;
    }

    carritoActual.forEach((item: CarritoItem) => {
      total += item.precio * item.cantidad;
      const mensajeHTML = item.mensaje ? `<p class="mensaje-carrito">Mensaje: "${item.mensaje}"</p>` : '';
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('carrito-item');
      itemDiv.dataset.id = item.id; 
      itemDiv.innerHTML = `
          <div class="carrito-item-info">
              <h4>${item.nombre}</h4>
              <p>Precio: $${item.precio.toLocaleString('es-CL')}</p>
              ${mensajeHTML}
          </div>
          <div class="carrito-item-cantidad">
              <button class="btn-cantidad disminuir" data-id="${item.id}">-</button>
              <span>${item.cantidad}</span>
              <button class="btn-cantidad aumentar" data-id="${item.id}">+</button>
          </div>
          <button class="carrito-item-eliminar" data-id="${item.id}">Eliminar</button>
      `;
      carritoItemsContainer.appendChild(itemDiv);
    });

    if (totalPrecioEl) {
      totalPrecioEl.textContent = `$${total.toLocaleString('es-CL')}`;
    }
  },


  agregarEventListenersCarrito(): void {
    const carritoItemsContainer = document.getElementById('carrito-items') as HTMLDivElement | null;
    if (carritoItemsContainer) {

      carritoItemsContainer.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const id = target.dataset.id;
        if (!id) return; 

        const item = storage.obtenerCarrito().find(p => p.id === id);
        if (!item) return;

        if (target.classList.contains('aumentar')) {
          this.actualizarCantidad(id, item.cantidad + 1);
        } else if (target.classList.contains('disminuir')) {
          this.actualizarCantidad(id, item.cantidad - 1); 
        } else if (target.classList.contains('carrito-item-eliminar')) {
          this.eliminarDelCarrito(id);
        }
      });
    }

    const btnFinalizarCompra = document.getElementById('finalizar-compra-btn');
    if (btnFinalizarCompra) {
      btnFinalizarCompra.addEventListener('click', () => {
        this.finalizarCompra();
      });
    }
  },


  finalizarCompra(): void {
    const carritoActual = storage.obtenerCarrito();
    if (carritoActual.length === 0) {
      mostrarAlertaWeb('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }
    
    mostrarAlertaWeb('¡Compra realizada con éxito! Gracias por tu pedido.');
    storage.limpiarCarrito();
    this.actualizarVistaCarrito();
    actualizarContadorCarrito();
  
  }
};

