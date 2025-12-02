import { storagePedidos } from './storage';
import type { Pedido } from './types';

function crearHtmlPedido(pedido: Pedido): string {
  const productosHtml = pedido.productos.map(
    (p) => `<li>${p.nombre} × ${p.cantidad} — $${(p.precio * p.cantidad).toLocaleString('es-CL')}</li>`
  ).join('');

  return `
    <div class="pedido-card">
      <div class="pedido-header">
        <span class="pedido-id">#${pedido.id.slice(0, 8)}</span>
        <span class="pedido-fecha">${pedido.fecha}</span>
      </div>
      <p><strong>Estado:</strong> ${pedido.estado}</p>
      <ul>${productosHtml}</ul>
      <p class="pedido-total"><strong>Total:</strong> $${pedido.total.toLocaleString('es-CL')}</p>
    </div>
  `;
}

async function mostrarPedidos(): Promise<void> {
  const contenedor = document.getElementById('lista-pedidos') as HTMLDivElement | null;
  if (!contenedor) return;

  const pedidos = await storagePedidos.obtenerPedidos();

  if (!pedidos || pedidos.length === 0) {
    contenedor.innerHTML = `<p class="no-pedidos">No tienes pedidos aún.</p>`;
    return;
  }

  contenedor.innerHTML = pedidos.map(crearHtmlPedido).join('');
}


document.addEventListener('DOMContentLoaded', () => {
  mostrarPedidos();
});
