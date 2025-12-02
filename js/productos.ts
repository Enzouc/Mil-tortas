import { apiRequest } from "./storage";
import type { Producto } from "./types";

// === API CRUD ===
export const productosData = {
    async obtenerTodos(): Promise<Producto[]> {
        return apiRequest<Producto[]>("/productos");
    },

    async obtenerPorId(id: string | number): Promise<Producto> {
        return apiRequest<Producto>(`/productos/${id}`);
    },

    async crear(datos: Producto): Promise<Producto> {
        return apiRequest<Producto>("/productos", {
            method: "POST",
            body: JSON.stringify(datos)
        });
    },

    async actualizar(id: string | number, datos: Producto): Promise<Producto> {
        return apiRequest<Producto>(`/productos/${id}`, {
            method: "PUT",
            body: JSON.stringify(datos)
        });
    },

    async eliminar(id: string | number): Promise<void> {
        await apiRequest(`/productos/${id}`, { method: "DELETE" });
    },
};

// === LÓGICA PARA productos.html (CLIENTE NORMAL) ===
export const productos = {
    async cargarProductosCliente(lista: HTMLElement, todos: Producto[]) {
        lista.innerHTML = "";

        todos.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("producto-card");

            card.innerHTML = `
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <span>$${p.precio}</span>
            `;

            lista.appendChild(card);
        });
    },

    inicializarBotones() {
        console.log("Botones inicializados");
    },

    async filtrarProductos() {
        console.log("Filtros aplicados");
    },
};

// === LÓGICA PARA ADMIN (admin.html) ===
export async function cargarProductosAdmin(content: HTMLElement) {
    content.innerHTML = `
        <h2>Gestión de Productos</h2>
        <button id="btn-agregar" class="btn-agregar">➕ Agregar Producto</button>

        <table class="tabla">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Tamaño</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="lista-productos"></tbody>
        </table>
    `;

    const lista = document.getElementById("lista-productos")!;

    async function listar() {
        const productos = await productosData.obtenerTodos();

        lista.innerHTML = productos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>$${p.precio}</td>
                <td>${p.categoria}</td>
                <td>${p.tipo}</td>
                <td>${p.tamano}</td>
                <td>
                    <button class="btn-editar" data-id="${p.id}">✏️</button>
                    <button class="btn-eliminar" data-id="${p.id}">🗑️</button>
                </td>
            </tr>
        `).join("");
    }

    listar();
}
