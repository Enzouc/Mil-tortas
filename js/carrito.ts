import { storage, storagePedidos } from './storage';
import type { Pedido } from './types';
import { productosData } from './productos';
import { mostrarAlertaWeb } from './app'; 
import type { CarritoItem } from './types';

export function actualizarContadorCarrito(): void {
  const contador = document.getElementById('contador-carrito') as HTMLSpanElement | null;
  if (contador) {
    const carritoActual = storage.obtenerCarrito() || [];
    const cantidadTotal = carritoActual.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = String(cantidadTotal);
  }
}

export const carrito = {
  agregarAlCarrito(id: string, mensaje: string = ''): void {
    const producto = productosData.obtenerPorId(id);
    if (!producto) return;

    let carritoActual = storage.obtenerCarrito() || [];
    const productoEnCarrito = carritoActual.find(item => item.id === id && item.mensaje === mensaje);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      const nuevoItem: CarritoItem = { ...producto, cantidad: 1, mensaje };
      carritoActual.push(nuevoItem);
    }

    storage.guardarCarrito(carritoActual);
    actualizarContadorCarrito();
    mostrarAlertaWeb(`¡${producto.nombre} fue agregado al carrito!`);
  },

  eliminarDelCarrito(id: string): void {
    let carritoActual = storage.obtenerCarrito() || [];
    carritoActual = carritoActual.filter(item => item.id !== id);
    storage.guardarCarrito(carritoActual);
    this.actualizarVistaCarrito();
    actualizarContadorCarrito();
    mostrarAlertaWeb('Producto eliminado del carrito.');
  },

  generarHtmlItem(item: CarritoItem): string {
    const subtotal = item.precio * item.cantidad;
    return `
      <div class="carrito-item-info">
        <h4>${item.nombre}</h4>
        ${item.mensaje ? `<p>Mensaje: ${item.mensaje}</p>` : ''}
        <span class="carrito-item-precio-unidad">$${item.precio.toLocaleString('es-CL')} c/u</span>
      </div>
      <div class="carrito-item-acciones">
        <div class="carrito-item-cantidad">
          <button class="disminuir" data-id="${item.id}">-</button>
          <span>${item.cantidad}</span>
          <button class="aumentar" data-id="${item.id}">+</button>
        </div>
        <span class="carrito-item-subtotal">$${subtotal.toLocaleString('es-CL')}</span>
        <button class="carrito-item-eliminar" data-id="${item.id}">Eliminar</button>
      </div>
    `;
  },

  actualizarVistaCarrito(): void {
    const carritoItemsContainer = document.getElementById('carrito-items') as HTMLDivElement | null;
    const carritoTotalElement = document.getElementById('carrito-total-monto') as HTMLSpanElement | null;
    const carritoActual = storage.obtenerCarrito() || [];

    if (!carritoItemsContainer || !carritoTotalElement) return;

    carritoItemsContainer.innerHTML = '';
    let total = 0;

    if (carritoActual.length === 0) {
      carritoItemsContainer.innerHTML = '<p class="text-center">Tu carrito de compras está vacío.</p>';
      carritoTotalElement.textContent = '$0';
      return;
    }

    carritoActual.forEach((item: CarritoItem) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('carrito-item');
      itemElement.innerHTML = this.generarHtmlItem(item);
      carritoItemsContainer.appendChild(itemElement);
      total += item.precio * item.cantidad;
    });

    carritoTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
  },

  actualizarCantidad(id: string, nuevaCantidad: number): void {
    let carritoActual = storage.obtenerCarrito() || [];
    const producto = carritoActual.find(item => item.id === id);
    if (!producto) return;

    if (nuevaCantidad < 1) {
      this.eliminarDelCarrito(id);
      return;
    }

    producto.cantidad = nuevaCantidad;
    storage.guardarCarrito(carritoActual);
    this.actualizarVistaCarrito();
    actualizarContadorCarrito();
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
      btnFinalizarCompra.addEventListener('click', () => this.finalizarCompra());
    }
  },

  finalizarCompra(): void {
    const carritoActual = storage.obtenerCarrito() || [];
    if (carritoActual.length === 0) {
      mostrarAlertaWeb('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    const total = carritoActual.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const nuevoPedido: Pedido = {
      id: crypto.randomUUID(),
      fecha: new Date().toLocaleString(),
      productos: carritoActual,
      total,
      estado: 'pendiente'
    };

    // Usar el helper del storage para agregar
    if (typeof storagePedidos?.agregarPedido === 'function') {
      storagePedidos.agregarPedido(nuevoPedido);
    } else {
      // Fallback: si storagePedidos no está disponible, realizar guardado manual
      const prev = (storagePedidos && typeof storagePedidos.obtenerPedidos === 'function')
        ? storagePedidos.obtenerPedidos()
        : [];
      prev.push(nuevoPedido);
      if (storagePedidos && typeof storagePedidos.guardarPedidos === 'function') {
        storagePedidos.guardarPedidos(prev);
      } else {
        // última opción: guardar directamente en localStorage
        localStorage.setItem('pedidos', JSON.stringify(prev));
      }
    }

    mostrarAlertaWeb('¡Compra realizada con éxito! Gracias por tu pedido.');
    storage.limpiarCarrito();
    this.actualizarVistaCarrito();
    actualizarContadorCarrito();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('carrito-pagina')) {
    carrito.actualizarVistaCarrito();
    carrito.agregarEventListenersCarrito();
  }
});
