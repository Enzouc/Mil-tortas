import { productosData } from "./productos.js";
import { storage, storagePedidos } from "./storage.js";

function mostrarAlertaCarrito(mensaje) {
  const modal = document.getElementById("modal-alerta");
  const texto = document.getElementById("modal-mensaje");
  const cerrarBtn = document.getElementById("modal-cerrar");

  if (modal && texto && cerrarBtn) {
    texto.textContent = mensaje;
    modal.classList.add("visible");
    cerrarBtn.onclick = () => modal.classList.remove("visible");
  } else {
    alert(mensaje);
  }
}

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
    const usuario = storage.obtenerUsuarioGuardado();
    const rol = usuario?.rol;
    const token = storage.getToken();

    if (!token || (rol && rol !== "CLIENTE")) {
      mostrarAlertaCarrito("Solo clientes autenticados pueden comprar. Usa una cuenta de cliente.");
      return;
    }

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

  async finalizarCompra(fechaEntregaPreferida) {
    const usuario = storage.obtenerUsuarioGuardado();
    const rol = usuario?.rol;
    const token = storage.getToken();
    if (!token || rol !== "CLIENTE") {
      mostrarAlertaCarrito("Debes iniciar sesión como cliente para comprar.");
      return;
    }

    const items = storage.obtenerCarrito();
    if (items.length === 0) {
      mostrarAlertaCarrito("Tu carrito está vacío.");
      return;
    }

    const payload = {
      usuarioId: usuario.id,
      fechaEntregaPreferida: fechaEntregaPreferida || null,
      items: items.map((it) => ({
        productoId: it.id,
        cantidad: it.cantidad,
        mensaje: it.mensaje || "",
      })),
    };

    try {
      await storagePedidos.agregarPedido(payload);
      storage.limpiarCarrito();
      await actualizarContadorCarrito();
      mostrarAlertaCarrito("Pedido confirmado. ¡Gracias por tu compra!");
    } catch (err) {
      console.error(err);
      mostrarAlertaCarrito("No se pudo procesar el pedido.");
    }
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
