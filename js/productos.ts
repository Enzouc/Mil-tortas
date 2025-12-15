import { apiRequest } from "./storage";
import { carrito } from "./carrito";
import type { Producto } from "./types";

// ============================================
// API REST – Productos
// ============================================

export const productosData = {
    async obtenerTodos(): Promise<Producto[]> {
        return apiRequest<Producto[]>("/productos");
    },

    async obtenerPorId(id: number | string): Promise<Producto> {
        return apiRequest<Producto>(`/productos/${id}`);
    },
};

// ============================================
// LÓGICA PARA productos.html
// ============================================

export const productos = {
    productosCache: [] as Producto[],
    categoriaActual: "todos",
    tamanoActual: "todos",

    // Inicializar vista
    async inicializar() {
        this.productosCache = await productosData.obtenerTodos();
        this.inicializarFiltros();
        this.inicializarModal();
        this.renderizar();
    },

    // Render catálogo
    renderizar() {
        const contenedor = document.getElementById("productos-grid")!;
        contenedor.innerHTML = "";

        let lista = [...this.productosCache];

        if (this.categoriaActual !== "todos") {
            lista = lista.filter(p => p.categoria === this.categoriaActual);
        }

        if (this.tamanoActual !== "todos") {
            lista = lista.filter(p => p.tamano === this.tamanoActual);
        }

        lista.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("producto-card");

            card.innerHTML = `
                <div class="producto-img">
                    <img src="${p.imagen}" alt="${p.nombre}">
                </div>

                <div class="producto-info">
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion}</p>
                    <span class="producto-precio">$${p.precio}</span>
                    <button class="ver-mas-btn" data-id="${p.id}">Ver más</button>
                </div>
            `;

            card.querySelector(".ver-mas-btn")!.addEventListener("click", () => {
                this.abrirModal(p.id);
            });

            contenedor.appendChild(card);
        });
    },

    // ============================================
    // Filtros
    // ============================================

    inicializarFiltros() {
        document.querySelectorAll(".categoria-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".categoria-btn")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");
                this.categoriaActual = btn.getAttribute("data-categoria") ?? "todos";
                this.renderizar();
            });
        });

        document.querySelectorAll(".tamano-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".tamano-btn")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");
                this.tamanoActual = btn.getAttribute("data-tamano") ?? "todos";
                this.renderizar();
            });
        });
    },

    // ============================================
    // Modal – abrir
    // ============================================

    abrirModal(id: number | string) {
        const prod = this.productosCache.find(p => p.id === Number(id));
        if (!prod) return;

        const modal = document.getElementById("producto-modal")!;
        modal.classList.remove("hidden");

        (document.getElementById("modal-imagen") as HTMLImageElement).src = prod.imagen;
        document.getElementById("modal-nombre")!.textContent = prod.nombre;
        document.getElementById("modal-descripcion")!.textContent = prod.descripcion;
        document.getElementById("modal-precio")!.textContent = "$" + prod.precio;

        document.getElementById("modal-agregar")!
            .setAttribute("data-id", prod.id.toString());
    },

    // ============================================
    // Modal – cerrar y agregar al carrito
    // ============================================

    inicializarModal() {
        // Cerrar modal
        document.getElementById("modal-cerrar")?.addEventListener("click", () => {
            document.getElementById("producto-modal")!.classList.add("hidden");
        });

        // Agregar al carrito
        document.getElementById("modal-agregar")?.addEventListener("click", async () => {
            const id = document.getElementById("modal-agregar")!
                .getAttribute("data-id");

            if (!id) return;

            const mensaje = (document.getElementById("modal-mensaje-input") as HTMLInputElement)?.value || "";

            // ESTE ES EL LLAMADO CORRECTO A TU CARRITO
            await carrito.agregarAlCarrito(id, mensaje);

            // Cerrar modal
            document.getElementById("producto-modal")!
                .classList.add("hidden");

            // Mostrar confirmación
            const confirm = document.getElementById("modal-confirmacion")!;
            confirm.classList.remove("hidden");

            document.getElementById("modal-confirmacion-cerrar")!.onclick = () =>
                confirm.classList.add("hidden");
        });
    },
};
