const API_BASE_URL = "http://localhost:8080/api/v1";

let carritoEnMemoria = [];
let authToken = localStorage.getItem("token");
let usuarioActual = JSON.parse(localStorage.getItem("usuario") || "null");

const normalizarUsuario = (usuario) => {
  if (!usuario) return null;
  return {
    ...usuario,
    beneficio: usuario.descuento ?? usuario.beneficio ?? 0,
  };
};

/* -------------------------------------------------------
   FUNCIÓN GLOBAL API REQUEST
-------------------------------------------------------- */
export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = authToken || localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) return null;
  return await response.json();
}

/* -------------------------------------------------------
   PRODUCTOS API
-------------------------------------------------------- */
export const productosApi = {
  async obtenerTodos() {
    return apiRequest("/productos");
  },

  async crearProducto(producto) {
    return apiRequest("/productos", {
      method: "POST",
      body: JSON.stringify(producto),
    });
  },

  async actualizarProducto(id, producto) {
    return apiRequest(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(producto),
    });
  },

  async eliminarProducto(id) {
    return apiRequest(`/productos/${id}`, { method: "DELETE" });
  },
};

/* -------------------------------------------------------
   USUARIOS API
-------------------------------------------------------- */
export const usuariosApi = {
  async obtenerTodos() {
    return apiRequest("/usuarios");
  },

  async crear(usuario) {
    return apiRequest("/usuarios", {
      method: "POST",
      body: JSON.stringify(usuario),
    });
  },

  async obtenerPorId(id) {
    return apiRequest(`/usuarios/${id}`);
  },

  async eliminar(id) {
    return apiRequest(`/usuarios/${id}`, { method: "DELETE" });
  },

  async actualizar(id, usuario) {
    return apiRequest(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    });
  },
};

/* -------------------------------------------------------
   PEDIDOS API
-------------------------------------------------------- */
export const storagePedidos = {
  async obtenerPedidos(admin = false) {
    const usuario = usuarioActual || normalizarUsuario(JSON.parse(localStorage.getItem("usuario") || "null"));
    let path = "/pedidos/mis-pedidos?usuarioId=" + (usuario?.id || "");
    if (admin && usuario?.rol === "ADMIN") path = "/pedidos/admin";
    else if (admin && usuario?.rol === "VENDEDOR") path = "/pedidos/vendedor";

    const pedidos = await apiRequest(path);

    // Normalizar detalles para el frontend
    return (pedidos || []).map((p) => ({
      ...p,
      detalles: (p.detalles || []).map((d) => ({
        nombre: d.producto?.nombre || "",
        cantidad: d.cantidad || 0,
        precioUnitario: d.precioUnitario || 0,
      })),
    }));
  },

  async agregarPedido(nuevoPedido) {
    return apiRequest("/pedidos", {
      method: "POST",
      body: JSON.stringify(nuevoPedido),
    });
  },

  async marcarListo(pedidoId) {
    return apiRequest(`/pedidos/${pedidoId}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado: "LISTO" }),
    });
  },
};

/* -------------------------------------------------------
   AUTH (LOGIN + REGISTER + AUTO LOGIN)
-------------------------------------------------------- */
export const auth = {
  async login(correo, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });

    const data = await res.json();
    if (data.activo === false) {
      throw new Error("La cuenta está deshabilitada");
    }
    const usuario = normalizarUsuario({
      id: data.id,
      nombre: data.nombre,
      correo: data.correo,
      rol: data.rol,
      descuento: data.descuento,
      regaloCumpleDuoc: data.regaloCumpleDuoc,
    });

    if (data.token) {
      authToken = data.token;
      localStorage.setItem("token", data.token);
    }
    if (usuario) {
      usuarioActual = usuario;
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }

    return { token: data.token, usuario };
  },

  async registerAndLogin(data) {
    const resultado = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const usuario = normalizarUsuario({
      id: resultado.id,
      nombre: resultado.nombre,
      correo: resultado.correo,
      rol: resultado.rol,
      descuento: resultado.descuento,
      regaloCumpleDuoc: resultado.regaloCumpleDuoc,
    });

    authToken = resultado.token;
    usuarioActual = usuario;

    localStorage.setItem("token", resultado.token);
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));

    return { token: resultado.token, usuario };
  },

  // Login por nombre de usuario (admin)
  async loginPorNombre(username, password) {
    return this.login(username, password);
  },
};

/* -------------------------------------------------------
   STORAGE LOCAL
-------------------------------------------------------- */
export const storage = {
  obtenerCarrito() {
return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []; },

  guardarCarrito(carrito) {
localStorage.setItem("carrito", JSON.stringify(carrito)); },

  limpiarCarrito() {
localStorage.removeItem("carrito");},

  getToken() {
    return authToken || localStorage.getItem("token");
  },

  obtenerUsuarioGuardado() {
    return usuarioActual;
  },

  async obtenerUsuario() {
    const usuario = await apiRequest("/usuarios/me");
    const normalizado = normalizarUsuario(usuario);
    usuarioActual = normalizado;
    localStorage.setItem("usuario", JSON.stringify(normalizado));
    return normalizado;
  },

  async guardarUsuario(usuario, usarPerfilActual = false) {
    if (usarPerfilActual) {
      const actualizado = await apiRequest("/usuarios/me", {
        method: "PUT",
        body: JSON.stringify(usuario),
      });
      const normalizado = normalizarUsuario(actualizado);
      usuarioActual = normalizado;
      localStorage.setItem("usuario", JSON.stringify(normalizado));
      return normalizado;
    } else {
      const id = usuario.id || usuarioActual?.id;
      if (!id) throw new Error("No hay usuario en sesión.");

      const actualizado = await usuariosApi.actualizar(id, usuario);
      const normalizado = normalizarUsuario(actualizado);
      usuarioActual = normalizado;
      localStorage.setItem("usuario", JSON.stringify(normalizado));

      return normalizado;
    }
  },

  limpiarUsuario() {
    usuarioActual = null;
    authToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },
};
