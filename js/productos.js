import { apiRequest } from "./storage.js";
import { carrito } from "./carrito.js";

// ============================================
// API REST - Productos
// ============================================
export const productosData = {
  async obtenerTodos() {
    return apiRequest("/productos");
  },

  async obtenerPorId(id) {
    return apiRequest(`/productos/${id}`);
  },
};

// ============================================
// LÓGICA PARA productos.html
// ============================================
export const productos = {
  productosCache: [],
  categoriaActual: "todos",
  tamanoActual: "todos",

  async inicializar() {
    try {
      this.productosCache = await productosData.obtenerTodos();
      this.inicializarFiltros();
      this.inicializarModal();
      this.renderizar();
    } catch (err) {
      console.error("No se pudieron cargar los productos", err);
    }
  },

  renderizar() {
    const contenedor = document.getElementById("productos-grid");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    let lista = [...this.productosCache];

    if (this.categoriaActual !== "todos") {
      lista = lista.filter((p) => p.categoria === this.categoriaActual);
    }

    if (this.tamanoActual !== "todos") {
      lista = lista.filter(
        (p) => p.tamano ? p.tamano === this.tamanoActual : true
      );
    }

    if (lista.length === 0) {
      contenedor.innerHTML = "<p>No hay productos para este filtro.</p>";
      return;
    }

    lista.forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("producto-card");

      card.innerHTML = `
        <div class="producto-img">
          <img src="${p.imagen || p.imagenUrl || ""}" alt="${p.nombre}">
        </div>

        <div class="producto-info">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <span class="producto-precio">$${p.precio}</span>
          <button class="ver-mas-btn" data-id="${p.id}">Ver más</button>
        </div>
      `;

      const verMas = card.querySelector(".ver-mas-btn");
      if (verMas) {
        verMas.addEventListener("click", () => this.abrirModal(p.id));
      }

      contenedor.appendChild(card);
    });
  },

  inicializarFiltros() {
    document.querySelectorAll(".categoria-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".categoria-btn")
          .forEach((b) => b.classList.remove("active"));

        btn.classList.add("active");
        this.categoriaActual = btn.getAttribute("data-categoria") || "todos";
        this.renderizar();
      });
    });

    document.querySelectorAll(".tamano-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".tamano-btn")
          .forEach((b) => b.classList.remove("active"));

        btn.classList.add("active");
        this.tamanoActual = btn.getAttribute("data-tamano") || "todos";
        this.renderizar();
      });
    });
  },

  abrirModal(id) {
    const prod = this.productosCache.find((p) => p.id === Number(id));
    if (!prod) return;

    const modal = document.getElementById("producto-modal");
    if (!modal) return;
    modal.classList.remove("hidden");

    const img = document.getElementById("modal-imagen");
    const nombre = document.getElementById("modal-nombre");
    const desc = document.getElementById("modal-descripcion");
    const precio = document.getElementById("modal-precio");
    const btnAgregar = document.getElementById("modal-agregar");

    if (img && "src" in img) img.src = prod.imagen;
    if (nombre) nombre.textContent = prod.nombre;
    if (desc) desc.textContent = prod.descripcion;
    if (precio) precio.textContent = "$" + prod.precio;
    if (btnAgregar) btnAgregar.setAttribute("data-id", String(prod.id));
  },

  inicializarModal() {
    const modalCerrar = document.getElementById("modal-cerrar");
    const modalAgregar = document.getElementById("modal-agregar");
    const modal = document.getElementById("producto-modal");

    modalCerrar?.addEventListener("click", () => {
      modal?.classList.add("hidden");
    });

    modalAgregar?.addEventListener("click", async () => {
      const id = modalAgregar.getAttribute("data-id");
      if (!id) return;

      const mensajeInput = document.getElementById("modal-mensaje-input");
      const mensaje =
        mensajeInput && "value" in mensajeInput ? mensajeInput.value : "";

      await carrito.agregarAlCarrito(id, mensaje);
      modal?.classList.add("hidden");

      const confirm = document.getElementById("modal-confirmacion");
      confirm?.classList.remove("hidden");

      const cerrarConfirm = document.getElementById(
        "modal-confirmacion-cerrar"
      );
      if (cerrarConfirm) {
        cerrarConfirm.onclick = () => confirm?.classList.add("hidden");
      }
    });
  },
};
