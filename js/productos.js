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
  modalInicializado: false,

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
    const prod = this.productosCache.find((p) => String(p.id) === String(id));
    if (!prod) return;
    const modal = document.getElementById("producto-modal");
    if (!modal) return;
    modal.classList.remove("hidden");

    const img = document.getElementById("modal-imagen");
    const nombre = document.getElementById("modal-nombre");
    const desc = document.getElementById("modal-descripcion");
    const precio = document.getElementById("modal-precio");
    const btnAgregar = document.getElementById("modal-agregar");
    const qtyInput = document.getElementById("qty-input");
    const shareWsp = document.getElementById("share-wsp");
    const shareX = document.getElementById("share-x");
    const shareIg = document.getElementById("share-ig");

    if (img && "src" in img) img.src = prod.imagen || prod.imagenUrl || "";
    if (nombre) nombre.textContent = prod.nombre;
    if (desc) desc.textContent = prod.descripcion;
    if (precio) precio.textContent = "$" + prod.precio;
    if (btnAgregar) btnAgregar.setAttribute("data-id", String(prod.id));
    if (qtyInput && "value" in qtyInput) qtyInput.value = "1";

    const url = encodeURIComponent(window.location.href.split("#")[0]);
    const text = encodeURIComponent(`${prod.nombre} - $${prod.precio}`);
    if (shareWsp && "href" in shareWsp) shareWsp.href = `https://wa.me/?text=${text}%20${url}`;
    if (shareX && "href" in shareX) shareX.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (shareIg && "href" in shareIg) shareIg.href = `https://www.instagram.com/?url=${url}`;
  },

  inicializarModal() {
    if (this.modalInicializado) return;
    this.modalInicializado = true;

    const modalCerrar = document.getElementById("modal-cerrar");
    const modalAgregar = document.getElementById("modal-agregar");
    const modal = document.getElementById("producto-modal");
    const overlayClose = document.getElementById("modal-overlay-close");
    const qtyMenor = document.getElementById("qty-menor");
    const qtyMayor = document.getElementById("qty-mayor");
    const qtyInput = document.getElementById("qty-input");

    const cerrarModal = () => modal?.classList.add("hidden");

    modalCerrar?.addEventListener("click", cerrarModal);
    overlayClose?.addEventListener("click", cerrarModal);

    qtyMenor?.addEventListener("click", () => {
      if (!qtyInput || !("value" in qtyInput)) return;
      const val = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
      qtyInput.value = String(val);
    });
    qtyMayor?.addEventListener("click", () => {
      if (!qtyInput || !("value" in qtyInput)) return;
      const val = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + 1);
      qtyInput.value = String(val);
    });

    modalAgregar?.addEventListener("click", async () => {
      const id = modalAgregar.getAttribute("data-id");
      if (!id) return;
      const cantidad =
        qtyInput && "value" in qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      await carrito.agregarAlCarrito(id, "", cantidad);
      modal?.classList.add("hidden");
console.log("Producto agregado al carrito");
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

  async inicializarDestacados() {
    // Asegurar listeners del modal incluso si el fetch falla
    this.inicializarModal();
    try {
      if (!this.productosCache.length) {
        this.productosCache = await productosData.obtenerTodos();
      }
      const grid = document.getElementById("destacados-grid");
      if (!grid) return;
      grid.innerHTML = "";
      const copia = [...this.productosCache];
      // shuffle simple
      copia.sort(() => 0.5 - Math.random());
      const seleccion = copia.slice(0, 3);
      seleccion.forEach((p) => {
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
        verMas?.addEventListener("click", () => this.abrirModal(p.id));
        grid.appendChild(card);
      });
    } catch (e) {
      console.error("No se pudieron cargar destacados", e);
    }
  },
};
