import type { CarritoItem, Pedido, Producto, Usuario } from "./types";

const API_BASE_URL = "http://localhost:8080/api/v1";

let carritoEnMemoria: CarritoItem[] = [];
let authToken: string | null = localStorage.getItem("token");
let usuarioActual: (Usuario & { id?: string }) | null =
  JSON.parse(localStorage.getItem("usuario") || "null");

/* -------------------------------------------------------
   🔹 FUNCION GLOBAL PARA LLAMAR A LA API
-------------------------------------------------------- */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Agregar token si existe
  const token = authToken || localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

/* -------------------------------------------------------
   🔹 PRODUCTOS API
-------------------------------------------------------- */
export const productosApi = {
  async obtenerTodos(): Promise<Producto[]> {
    return apiRequest<Producto[]>("/productos");
  },

  async crearProducto(producto: Producto): Promise<Producto> {
    return apiRequest<Producto>("/productos", {
      method: "POST",
      body: JSON.stringify(producto),
    });
  },
};

/* -------------------------------------------------------
   🔹 USUARIOS API
-------------------------------------------------------- */
export const usuariosApi = {
  async obtenerTodos(): Promise<Usuario[]> {
    return apiRequest<Usuario[]>("/usuarios");
  },

  async obtenerPorId(id: string): Promise<Usuario> {
    return apiRequest<Usuario>(`/usuarios/${id}`);
  },

  async eliminar(id: string): Promise<void> {
    return apiRequest<void>(`/usuarios/${id}`, { method: "DELETE" });
  },

  async actualizar(id: string, usuario: Usuario): Promise<Usuario> {
    return apiRequest<Usuario>(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    });
  },
};

/* -------------------------------------------------------
   🔹 PEDIDOS API
-------------------------------------------------------- */
export const storagePedidos = {
  async obtenerPedidos(): Promise<Pedido[]> {
    return apiRequest<Pedido[]>("/pedidos");
  },

  async agregarPedido(nuevoPedido: Pedido): Promise<Pedido> {
    return apiRequest<Pedido>("/pedidos", {
      method: "POST",
      body: JSON.stringify(nuevoPedido),
    });
  },
};

/* -------------------------------------------------------
   🔹 STORAGE GENERAL (LOGIN, TOKEN, USUARIO)
-------------------------------------------------------- */
export const storage = {
  obtenerCarrito(): CarritoItem[] {
    return [...carritoEnMemoria];
  },

  guardarCarrito(carrito: CarritoItem[]): void {
    carritoEnMemoria = [...carrito];
  },

  limpiarCarrito() {
    carritoEnMemoria = [];
  },

  /* ---------------------
      LOGIN
  ----------------------*/
  async login(correo: string, password: string) {
    const resultado = await apiRequest<{ token: string; usuario: Usuario }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ correo, password }),
      }
    );

    authToken = resultado.token;
    usuarioActual = resultado.usuario;

    localStorage.setItem("token", resultado.token);
    localStorage.setItem("usuario", JSON.stringify(usuarioActual));

    return resultado;
  },

  async loginPorNombre(usuario: string, password: string) {
    return this.login(usuario, password);
  },

  /* ---------------------
      GETTERS
  ----------------------*/
  getToken(): string | null {
    return authToken || localStorage.getItem("token");
  },

  obtenerUsuarioGuardado() {
    return usuarioActual;
  },

  async obtenerUsuario() {
    const usuario = await apiRequest<Usuario>("/usuarios/me");

    usuarioActual = usuario;
    localStorage.setItem("usuario", JSON.stringify(usuario));

    return usuario;
  },

  /* ---------------------
      ACTUALIZACIÓN
  ----------------------*/
  async guardarUsuario(usuario: Usuario & { id?: string }) {
    const id = usuario.id || usuarioActual?.id;
    if (!id) throw new Error("No hay usuario para actualizar.");

    const actualizado = await usuariosApi.actualizar(id, usuario);

    usuarioActual = actualizado;
    localStorage.setItem("usuario", JSON.stringify(actualizado));

    return actualizado;
  },

  /* ---------------------
      LOGOUT
  ----------------------*/
  limpiarUsuario() {
    usuarioActual = null;
    authToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },
};
