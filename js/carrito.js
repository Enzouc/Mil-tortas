import { productosData } from "./productos.js";
import { storage } from "./storage.js";

function construirItem(producto, mensaje) {
  return {
    ...producto,
    cantidad: 1,
    mensaje: mensaje ?? "",
  };
}

export async function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  const items = storage.obtenerCarrito();
  const total = items.reduce((acum, item) => acum + (item.cantidad ?? 0), 0);
  contador.textContent = String(total);
}

export const carrito = {
  async agregarAlCarrito(productoId, mensaje) {
    const producto = await productosData.obtenerPorId(productoId);
    const carritoActual = storage.obtenerCarrito();

    const existente = carritoActual.find((item) => item.id === producto.id);

    if (existente) {
      existente.cantidad += 1;
      existente.mensaje = mensaje ?? existente.mensaje;
    } else {
      carritoActual.push(construirItem(producto, mensaje));
    }

    storage.guardarCarrito(carritoActual);
    await actualizarContadorCarrito();
  },

  actualizarVistaCarrito() {
    const contenedor = document.getElementById("carrito-items");
    const totalDom = document.getElementById("carrito-total-monto");
    if (!contenedor || !totalDom) return;

    const items = storage.obtenerCarrito();
    const usuario = storage.obtenerUsuarioGuardado();

    if (items.length === 0) {
      contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
      totalDom.textContent = "$0";
      return;
    }

    // Subtotal antes del descuento
    let subtotal = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );

    // Aplicación de descuento directamente en frontend
    let descuento = 0;
    let totalFinal = subtotal;

    if (usuario?.beneficio && usuario.beneficio > 0) {
      descuento = Math.floor(subtotal * (usuario.beneficio / 100));
      totalFinal = subtotal - descuento;
    }

    // Render productos
    contenedor.innerHTML = items
      .map(
        (item) => `
      <div class="carrito-item">
        <h4>${item.nombre}</h4>
        <p>${item.descripcion}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <p>Precio unitario: $${item.precio}</p>
        <hr>
      </div>
    `
      )
      .join("");

    // Render totales
    totalDom.innerHTML = `
       <strong>
        ${
          descuento > 0
            ? `Subtotal: $${subtotal}<br>
             Cupón aplicado (${usuario.beneficio}%) → -$${descuento}<br>
             TOTAL FINAL: $${totalFinal}`
            : `TOTAL: $${subtotal}`
        }
       </strong>
    `;
  },
};
