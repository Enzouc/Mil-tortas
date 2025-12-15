import { productosApi } from "./storage.js";
import { storagePedidos } from "./storage.js";
import { showAlert } from "./alertas.js";

// Validar rol vendedor
const userStr = localStorage.getItem("usuario");
const user = userStr ? JSON.parse(userStr) : null;
if (!user || user.rol !== "VENDEDOR") {
  window.location.href = "login.html";
}


const navMenu = document.getElementById("menu");
if (navMenu) {
  navMenu.querySelectorAll("li").forEach((li) => {
    const link = li.querySelector("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (!href.includes("vendedor.html") && !href.includes("#") && !link.id?.includes("logout")) {
      li.style.display = "none";
    }
  });
}

const contentProductos = document.getElementById("vendedor-productos");
const contentPedidos = document.getElementById("vendedor-pedidos");
const sectionProductos = document.getElementById("section-productos");
const sectionPedidos = document.getElementById("section-pedidos");
const bottomLinks = document.querySelectorAll(".nav-bottom a");

bottomLinks.forEach((link) => {
  link.addEventListener("click", () => {
    bottomLinks.forEach((l) => l.classList.remove("activo"));
    link.classList.add("activo");
    const sec = link.getAttribute("data-section");
    cargarSeccion(sec);
  });
});

cargarSeccion("productos");

function cargarSeccion(sec) {
  if (sec === "productos") {
    renderProductos();
    if (sectionPedidos) sectionPedidos.style.display = "none";
    if (sectionProductos) sectionProductos.style.display = "block";
  } else if (sec === "pedidos") {
    renderPedidos();
    if (sectionProductos) sectionProductos.style.display = "none";
    if (sectionPedidos) sectionPedidos.style.display = "block";
  }
}

async function renderProductos() {
  if (!contentProductos) return;
  contentProductos.innerHTML = "Cargando productos...";
  try {
    const productos = await productosApi.obtenerTodos();
    if (!productos || productos.length === 0) {
      contentProductos.textContent = "Sin productos.";
      return;
    }
    contentProductos.innerHTML = productos
      .map(
        (p) => `
        <div class="admin-card">
          <strong>${p.nombre}</strong> (${p.categoria}) - $${p.precio}
          <div>Tamaño: ${p.tamano || "N/A"}</div>
          <div>${p.descripcion || ""}</div>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error(err);
    contentProductos.textContent = "Error cargando productos.";
  }
}

async function renderPedidos() {
  if (!contentPedidos) return;
  contentPedidos.innerHTML = "Cargando pedidos...";
  try {
    const pedidos = await storagePedidos.obtenerPedidos(true);
    if (!pedidos || pedidos.length === 0) {
      contentPedidos.textContent = "Sin pedidos.";
      return;
    }
    contentPedidos.innerHTML = pedidos
      .map((p) => {
        const detalles = (p.detalles || []).map(
          (d) => `<li>${d.nombre || d.producto?.nombre || ""} x ${d.cantidad} ($${d.precioUnitario || 0})</li>`
        ).join("");
        const estado = p.estado || "PENDIENTE";
        const accion = estado === "LISTO"
          ? `<span class="badge badge-success">Listo para entrega</span>`
          : `<button class="btn-primario btn-sm marcar-listo" data-id="${p.id}">Marcar listo</button>`;
        return `
        <div class="admin-card">
          <div class="fila-pedido">
            <div><strong>Pedido #${p.id}</strong> - Total: $${p.total || 0}</div>
            <div>Estado: <strong>${estado}</strong> ${accion}</div>
          </div>
          <ul class="lista-simple">${detalles}</ul>
        </div>
      `;
      })
      .join("");

    contentPedidos.querySelectorAll(".marcar-listo").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (!id) return;
        btn.disabled = true;
        try {
          await storagePedidos.marcarListo(id);
          showAlert("Pedido marcado como listo.");
          await renderPedidos();
        } catch (err) {
          console.error(err);
          showAlert("No se pudo actualizar el pedido.");
        } finally {
          btn.disabled = false;
        }
      });
    });
  } catch (err) {
    console.error(err);
    contentPedidos.textContent = "Error cargando pedidos.";
  }
}
