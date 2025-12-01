import type { CarritoItem, Pedido, Producto, Usuario } from './types';

const API_BASE_URL = '/api/v1';
let carritoEnMemoria: CarritoItem[] = [];
let authToken: string | null = null;
let usuarioActual: (Usuario & { id?: string }) | null = null;

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return await response.json() as T;
}

export const productosApi = {
  async obtenerTodos(): Promise<Producto[]> {
    return apiRequest<Producto[]>('/productos');
  },

  async crearProducto(producto: Producto): Promise<Producto> {
    return apiRequest<Producto>('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  },
};

export const usuariosApi = {
  async obtenerTodos(): Promise<Usuario[]> {
    return apiRequest<Usuario[]>('/usuarios');
  },

  async obtenerPorId(id: string): Promise<Usuario> {
    return apiRequest<Usuario>(`/usuarios/${id}`);
  },

  async eliminar(id: string): Promise<void> {
    await apiRequest<void>(`/usuarios/${id}`, { method: 'DELETE' });
  },

  async actualizar(id: string, usuario: Usuario): Promise<Usuario> {
    return apiRequest<Usuario>(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  },
};

export const storagePedidos = {
  async obtenerPedidos(): Promise<Pedido[]> {
    return apiRequest<Pedido[]>('/pedidos');
  },

  async agregarPedido(nuevoPedido: Pedido): Promise<Pedido> {
    return apiRequest<Pedido>('/pedidos', {
      method: 'POST',
      body: JSON.stringify(nuevoPedido),
    });
  },
};

export const storage = {
  obtenerCarrito(): CarritoItem[] {
    return [...carritoEnMemoria];
  },

  guardarCarrito(carrito: CarritoItem[]): void {
    carritoEnMemoria = [...carrito];
  },

  limpiarCarrito(): void {
    carritoEnMemoria = [];
  },

  async login(email: string, password: string): Promise<{ token?: string; usuario?: Usuario & { id?: string } }> {
    const resultado = await apiRequest<{ token?: string; usuario?: Usuario & { id?: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    authToken = resultado.token ?? null;
    if (resultado.usuario) {
      usuarioActual = resultado.usuario;
    }

    return resultado;
  },

  getToken(): string | null {
    return authToken;
  },

  setUsuario(usuario: Usuario & { id?: string } | null): void {
    usuarioActual = usuario;
  },

  async obtenerUsuario(id?: string): Promise<(Usuario & { id?: string }) | null> {
    const userId = id || usuarioActual?.id;
    if (!userId) return null;

    const usuario = await usuariosApi.obtenerPorId(userId);
    usuarioActual = usuario;
    return usuario;
  },

  async guardarUsuario(usuario: Usuario & { id?: string }): Promise<Usuario> {
    const targetId = usuario.id || usuarioActual?.id;
    if (!targetId) {
      throw new Error('No hay un usuario autenticado para guardar.');
    }

    const usuarioActualizado = await usuariosApi.actualizar(targetId, usuario);
    usuarioActual = usuarioActualizado;
    return usuarioActualizado;
  },

  limpiarUsuario(): void {
    usuarioActual = null;
    authToken = null;
  },
};

