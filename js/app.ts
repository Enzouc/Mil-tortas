import { storage } from './storage';
import { productosData, productos } from './productos';
import { carrito, actualizarContadorCarrito } from './carrito';
import { inicializarPerfil } from './perfil';
import { validacion } from './validacion';
import type { Producto } from './types';

export function mostrarAlertaWeb(mensaje: string): void {
  const modal = document.getElementById("modal-alerta") as HTMLDivElement | null;
  const texto = document.getElementById("modal-mensaje") as HTMLElement | null;
  const cerrarBtn = document.getElementById("modal-cerrar") as HTMLButtonElement | null;

  if (!modal || !texto || !cerrarBtn) {
    console.error("❌ Error: No se encontró el modal en el DOM.");
    alert(mensaje);  
    return;
  }

  texto.textContent = mensaje;
  modal.classList.add("visible");

  cerrarBtn.onclick = () => {
    modal.classList.remove("visible");
  };
}


function inicializarNavegacion(): void {
  const currentPage = window.location.href.split('/').pop()?.split('?')[0] || '';
  const navLinks = document.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');

    if (linkPage && currentPage.includes(linkPage)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

async function actualizarNavegacionUsuario(): Promise<void> {
  const usuario = await storage.obtenerUsuario();
  const linkRegistroPerfil = document.querySelector('header #nav-registro-perfil') as HTMLAnchorElement | null;
  const linkPedidos = document.getElementById('nav-pedidos') as HTMLAnchorElement | null;
  const pedidosItem = document.getElementById('nav-pedidos-item');

  if (linkRegistroPerfil) {
    if (usuario) {
      linkRegistroPerfil.textContent = 'Mi Perfil';
      linkRegistroPerfil.href = 'perfil.html';

      if (linkPedidos) linkPedidos.style.display = 'inline-block';
      if (pedidosItem) pedidosItem.style.display = 'list-item';
    } else {
      linkRegistroPerfil.textContent = 'Registro';
      linkRegistroPerfil.href = 'registro.html';

      if (linkPedidos) linkPedidos.style.display = 'none';
      if (pedidosItem) pedidosItem.style.display = 'none';
    }
  }
}

async function cargarProductosDestacados(): Promise<void> {
  const grid = document.getElementById('destacados-grid') as HTMLDivElement | null;
  if (!grid) return;

  const productosDestacados: Producto[] = (await productosData.obtenerTodos()).slice(0, 4);

  if (productosDestacados.length === 0) {
    grid.innerHTML = '<p class="text-center">No hay productos destacados.</p>';
    return;
  }

  grid.innerHTML = '';
  productosDestacados.forEach((producto: Producto) => {
    const productoElement = document.createElement('div');
    productoElement.classList.add('producto-card');

    const imagenProducto: string = producto.imagen || 'https://placehold.co/300x200/FFF5E1/5D4037?text=Mil+Sabores';

    productoElement.innerHTML = `
      <div class="producto-img">
          <img src="${imagenProducto}" alt="${producto.nombre}">
      </div>
      <div class="producto-info">
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion.substring(0, 70)}...</p>
          <span class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</span>
          <button class="agregar-carrito-btn" data-id="${producto.id}">Agregar al Carrito</button>
      </div>
    `;
    grid.appendChild(productoElement);
  });
}


document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (target.matches('.agregar-carrito-btn')) {
    const productoId = target.dataset.id;

    if (productoId) {
      const mensajeInput = document.getElementById(`mensaje-${productoId}`) as HTMLInputElement | null;
      const mensaje = mensajeInput ? mensajeInput.value.trim() : '';
      void carrito.agregarAlCarrito(productoId, mensaje);
    }
  }
});


document.addEventListener('DOMContentLoaded', () => {
  void (async () => {

    const isLoginPage = window.location.pathname.endsWith("login.html");

    inicializarNavegacion();
    actualizarContadorCarrito();

    // ⛔ NO ejecutar nada que requiera token en login.html
    if (!isLoginPage) {
      try {
        await actualizarNavegacionUsuario();
      } catch (e) {
        console.warn("No se pudo cargar el usuario (esperado si no hay sesión).");
      }
    }

    if (!isLoginPage && document.getElementById('destacados-grid')) {
      await cargarProductosDestacados();
    }

    if (!isLoginPage && document.getElementById('productos-grid')) {
      productos.inicializarBotones();
      const todos = await productosData.obtenerTodos();
      await productos.cargarProductos(todos);
      await productos.filtrarProductos();
    }

    if (!isLoginPage && document.getElementById('carrito-pagina')) {
      carrito.actualizarVistaCarrito();
      carrito.agregarEventListenersCarrito();
    }

    if (!isLoginPage && document.getElementById('formulario-actualizacion')) {
      await inicializarPerfil();
    }

    if (!isLoginPage && document.getElementById('formulario-registro')) {
      validacion.inicializar();
    }

  })();
});

