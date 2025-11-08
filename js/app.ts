import { storage } from './storage';
import { productosData, productos } from './productos';
import { carrito, actualizarContadorCarrito } from './carrito';
import { inicializarPerfil } from './perfil';
import { validacion } from './validacion';
import type { Producto } from './types';

/**
 * @param {string} mensaje -
 */
export function mostrarAlertaWeb(mensaje: string): void {
  const modal = document.getElementById('modal-alerta') as HTMLDivElement | null;
  const mensajeEl = document.getElementById('modal-mensaje') as HTMLParagraphElement | null;
  const cerrarBtn = document.getElementById('modal-cerrar') as HTMLButtonElement | null;

  if (!modal || !mensajeEl || !cerrarBtn) {
    alert(mensaje);
    return;
  }

 
  mensajeEl.innerText = mensaje;
  
  modal.classList.add('visible');

  const cerrarModal = () => {
    modal.classList.remove('visible');
    cerrarBtn.removeEventListener('click', cerrarModal);
  };

  cerrarBtn.addEventListener('click', cerrarModal, { once: true });
}

/**
 */
function inicializarNavegacion(): void {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a') as NodeListOf<HTMLAnchorElement>;
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 */
function actualizarNavegacionUsuario(): void {
  const usuario = storage.obtenerUsuario();
  const linkRegistroPerfil = document.getElementById('nav-registro-perfil') as HTMLAnchorElement | null;
  
  if (linkRegistroPerfil) {
    if (usuario) {
      linkRegistroPerfil.textContent = 'Mi Perfil';
      linkRegistroPerfil.href = 'perfil.html';
    } else {
      linkRegistroPerfil.textContent = 'Registro';
      linkRegistroPerfil.href = 'registro.html';
    }
  }
}

/**
 */
function cargarProductosDestacados(): void {
  const grid = document.getElementById('destacados-grid') as HTMLDivElement | null;
  if (!grid) return; // No estamos en la página de inicio

  const productosDestacados: Producto[] = productosData.obtenerTodos().slice(0, 4);

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
            <img src="${imagenProducto}" alt="Imagen de ${producto.nombre}">
        </div>
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion.substring(0, 70)}...</p>
            <span class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</span>
            <!-- No ponemos input de mensaje en destacados para simplificar -->
            <button class="agregar-carrito-btn" data-id="${producto.id}">Agregar al Carrito</button>
        </div>
    `;
    grid.appendChild(productoElement);
  });
}


document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement; // El elemento clickeado
  
  if (target.matches('.agregar-carrito-btn')) {
    const productoId = target.dataset.id; // Obtenemos el ID del producto
    
    if (productoId) {
      const mensajeInput = document.getElementById(`mensaje-${productoId}`) as HTMLInputElement | null;
      const mensaje = mensajeInput ? mensajeInput.value.trim() : '';

      carrito.agregarAlCarrito(productoId, mensaje);
    }
  }
});



document.addEventListener('DOMContentLoaded', () => {
   
  inicializarNavegacion();
  actualizarContadorCarrito(); 
  actualizarNavegacionUsuario();

    if (document.getElementById('destacados-grid')) {
    cargarProductosDestacados();
  }
  
  if (document.getElementById('productos-grid')) {
    productos.inicializarFiltros();
    productos.filtrarProductos(); 
  
  if (document.getElementById('carrito-pagina')) {
    carrito.actualizarVistaCarrito();
    carrito.agregarEventListenersCarrito();
  }
  
  if (document.getElementById('formulario-actualizacion')) {
    inicializarPerfil();
  }
  
  if (document.getElementById('formulario-registro')) {
    validacion.inicializar();
  }
  

});