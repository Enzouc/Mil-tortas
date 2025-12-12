import { storagePedidos } from "./storage.js";

function crearHtmlPedido(pedido) {
  const productosHtml = (pedido.detalles || pedido.productos || [])
    .map(
      (p) =>
        `<li>${p.nombre} - ${p.cantidad} -> $${(p.precio || p.precioUnitario || 0) * p.cantidad}</li>`
    )
    .join("");

  return `
    <div class="pedido-card">
      <div class="pedido-header">
        <span class="pedido-id">#${String(pedido.id || "").slice(0, 8)}</span>
        <span class="pedido-fecha">${pedido.fecha || ""}</span>
      </div>
      <p><strong>Estado:</strong> ${pedido.estado || "Pendiente"}</p>
      <ul>${productosHtml}</ul>
      <p class="pedido-total"><strong>Total:</strong> $${pedido.total || 0}</p>
    </div>
  `;
}

async function mostrarPedidos() {
  const contenedor = document.getElementById("lista-pedidos");
  if (!contenedor) return;

  const pedidos = await storagePedidos.obtenerPedidos();

  if (!pedidos || pedidos.length === 0) {
    contenedor.innerHTML = `<p class="no-pedidos">No tienes pedidos aún.</p>`;
    return;
  }

  contenedor.innerHTML = pedidos.map(crearHtmlPedido).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarPedidos();
});
