document.addEventListener('DOMContentLoaded', function () {
   
    inicializarNavegacion();
    actualizarContadorCarrito();
    actualizarNavegacionUsuario();

 
    if (document.getElementById('destacados-grid')) {
        cargarProductosDestacados();
    }
});


function cargarProductosDestacados() {
    const grid = document.getElementById('destacados-grid');
    if (!grid) return;

    const productosDestacados = productosData.obtenerTodos().slice(0, 4);

    if (productosDestacados.length === 0) {
        grid.innerHTML = '<p class="text-center">No hay productos destacados en este momento.</p>';
        return;
    }

    grid.innerHTML = ''; 

    productosDestacados.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto-card');
        
        const imagenProducto = producto.imagen || 'https://placehold.co/300x200/FFF5E1/5D4037?text=Mil+Sabores';

        productoElement.innerHTML = `
            <div class="producto-img">
                <img src="${imagenProducto}" alt="Imagen de ${producto.nombre}">
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <span class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</span>
                <button class="agregar-carrito-btn" data-id="${producto.id}">Agregar al Carrito</button>
            </div>
        `;
        grid.appendChild(productoElement);
    });
}


function configurarFiltros() {
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.categoria-btn.active').classList.remove('active');
            btn.classList.add('active');
            filtrarYMostrarProductos();
        });
    });

    document.getElementById('filtro-tamano').addEventListener('change', filtrarYMostrarProductos);
}


function filtrarYMostrarProductos() {
    const todosLosProductos = productosData.obtenerTodos();

    const categoriaSeleccionada = document.querySelector('.categoria-btn.active').dataset.categoria;
    const tamanoSeleccionado = document.getElementById('filtro-tamano').value;

    const productosFiltrados = todosLosProductos.filter(producto => {
        const coincideCategoria = categoriaSeleccionada === 'todos' || producto.tipo === categoriaSeleccionada;
        const coincideTamano = tamanoSeleccionado === 'todos' || producto.tamaño === tamanoSeleccionado;
        return coincideCategoria && coincideTamano;
    });

    renderizarProductos(productosFiltrados);
}

/**
 * @param {Array} productos - 
 */
function renderizarProductos(productos) {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = ''; 

    if (productos.length === 0) {
        grid.innerHTML = '<p class="sin-resultados">No se encontraron tortas que coincidan con tu búsqueda.</p>';
        return;
    }

    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto-card');
        productoElement.innerHTML = `
            <div class="producto-img">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <span class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</span>

                <!-- Campo para el mensaje de personalización -->
                <div class="personalizacion">
                    <label for="mensaje-${producto.id}">Mensaje especial (opcional):</label>
                    <input type="text" id="mensaje-${producto.id}" class="mensaje-personalizado" placeholder="Ej: ¡Feliz Aniversario!">
                </div>
                
                <button class="agregar-carrito-btn" data-id="${producto.id}">Agregar al Carrito</button>
            </div>
        `;
        grid.appendChild(productoElement);
    });
}


document.addEventListener('click', (e) => {
    if (e.target.matches('.agregar-carrito-btn')) {
        const productoId = e.target.dataset.id;
        
        const mensajeInput = document.getElementById(`mensaje-${productoId}`);
        const mensaje = mensajeInput ? mensajeInput.value.trim() : '';

        carrito.agregarAlCarrito(productoId, mensaje);
    }
});


function inicializarNavegacion() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const carritoActual = storage.obtenerCarrito();
        const cantidadTotal = carritoActual.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = cantidadTotal;
    }
}

function actualizarNavegacionUsuario() {
    const usuario = storage.obtenerUsuario();
    const linkRegistroPerfil = document.getElementById('nav-registro-perfil');
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
 * Muestra un modal de alerta web.
 * @param {string} mensaje El texto a mostrar en el modal.
 */
function mostrarAlertaWeb(mensaje) {
  const modal = document.getElementById('modal-alerta');
  const mensajeEl = document.getElementById('modal-mensaje');
  const cerrarBtn = document.getElementById('modal-cerrar');

  if (!modal || !mensajeEl || !cerrarBtn) {
    alert(mensaje);
    return;
  }

  mensajeEl.innerHTML = mensaje;
  
  modal.classList.add('visible');

  function cerrarModal() {
    modal.classList.remove('visible');
    cerrarBtn.removeEventListener('click', cerrarModal);
  }

  cerrarBtn.addEventListener('click', cerrarModal);
}