import { productosData } from './productos';
import { storage } from './storage';
import type { CarritoItem, Producto } from './types';

function construirItem(producto: Producto, mensaje?: string): CarritoItem {
  return {
    ...producto,
    cantidad: 1,
    mensaje: mensaje ?? '',
  };
}

export async function actualizarContadorCarrito(): Promise<void> {
  const contador = document.getElementById('contador-carrito');
  if (!contador) return;

  const items = storage.obtenerCarrito();
  const total = items.reduce((acum, item) => acum + (item.cantidad ?? 0), 0);
  contador.textContent = String(total);
}

export const carrito = {
  async agregarAlCarrito(productoId: string, mensaje?: string): Promise<void> {
    const producto = await productosData.obtenerPorId(productoId);
    const carritoActual = storage.obtenerCarrito();

    const existente = carritoActual.find(item => item.id === producto.id);
    if (existente) {
      existente.cantidad += 1;
      existente.mensaje = mensaje ?? existente.mensaje;
    } else {
      carritoActual.push(construirItem(producto, mensaje));
    }

    storage.guardarCarrito(carritoActual);
    await actualizarContadorCarrito();
  },

  actualizarVistaCarrito(): void {
    const contenedor = document.getElementById('carrito-lista');
    if (!contenedor) return;

    const items = storage.obtenerCarrito();
    if (items.length === 0) {
      contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
      return;
    }

    contenedor.innerHTML = items.map(item => `
      <div class="carrito-item" data-id="${item.id}">
        <div class="carrito-info">
          <h4>${item.nombre}</h4>
          <p>${item.descripcion}</p>
          <span class="precio">$${item.precio}</span>
        </div>
        <div class="carrito-acciones">
          <input type="number" class="cantidad" value="${item.cantidad}" min="1" />
          <button class="eliminar">Eliminar</button>
        </div>
      </div>
    `).join('');
  },

  agregarEventListenersCarrito(): void {
    const contenedor = document.getElementById('carrito-lista');
    if (!contenedor) return;

    contenedor.addEventListener('input', e => {
      const target = e.target as HTMLInputElement;
      if (!target.classList.contains('cantidad')) return;

      const itemElement = target.closest('.carrito-item') as HTMLElement | null;
      const id = itemElement?.dataset.id;
      if (!id) return;

      const nuevoValor = Number(target.value) || 1;
      const carritoActual = storage.obtenerCarrito();
      const item = carritoActual.find(p => p.id === id);
      if (!item) return;

      item.cantidad = nuevoValor;
      storage.guardarCarrito(carritoActual);
      void actualizarContadorCarrito();
    });

    contenedor.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('eliminar')) return;

      const itemElement = target.closest('.carrito-item') as HTMLElement | null;
      const id = itemElement?.dataset.id;
      if (!id) return;

      const carritoActual = storage.obtenerCarrito().filter(item => item.id !== id);
      storage.guardarCarrito(carritoActual);

      itemElement.remove();
      void actualizarContadorCarrito();
    });
  },
};
