const carrito = {
    /**
     * @param {number} id 
     * @param {string} [mensaje=''] 
     */
    agregarAlCarrito: function (id, mensaje = '') {
        const producto = productosData.obtenerPorId(id);
        if (!producto) return;

        let carritoActual = storage.obtenerCarrito();
        const productoEnCarrito = carritoActual.find(item => item.id === id && item.mensaje === mensaje);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            const nuevoItem = {
                ...producto,
                cantidad: 1,
                mensaje: mensaje 
            };
            carritoActual.push(nuevoItem);
        }

        storage.guardarCarrito(carritoActual);
        actualizarContadorCarrito();
        mostrarAlertaWeb(`¡${producto.nombre} fue agregado al carrito!`);
    },

    eliminarDelCarrito: function (id) {
        let carritoActual = storage.obtenerCarrito();
        carritoActual = carritoActual.filter(item => item.id !== id);
        storage.guardarCarrito(carritoActual);
        this.actualizarVistaCarrito();
        actualizarContadorCarrito();
    },

    actualizarCantidad: function (id, nuevaCantidad) {
        if (nuevaCantidad < 1) return;
        let carritoActual = storage.obtenerCarrito();
        const producto = carritoActual.find(item => item.id === id);
        if (producto) {
            producto.cantidad = nuevaCantidad;
            storage.guardarCarrito(carritoActual);
            this.actualizarVistaCarrito();
            actualizarContadorCarrito();
        }
    },

    actualizarVistaCarrito: function () {
        const carritoItemsContainer = document.getElementById('carrito-items');
        const totalPrecioEl = document.getElementById('total-precio');

        if (!carritoItemsContainer) return;

        const carritoActual = storage.obtenerCarrito();
        let total = 0;
        carritoItemsContainer.innerHTML = ''; 

        if (carritoActual.length === 0) {
            carritoItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
            if (totalPrecioEl) {
                totalPrecioEl.textContent = `$0`;
            }
            return;
        }

        carritoActual.forEach(item => {
            total += item.precio * item.cantidad;
            const mensajeHTML = item.mensaje ? `<p>Mensaje: "${item.mensaje}"</p>` : '';
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            itemDiv.innerHTML = `
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>Precio: $${item.precio.toLocaleString('es-CL')}</p>
                    ${mensajeHTML}
                </div>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad disminuir" data-id="${item.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad aumentar" data-id="${item.id}">+</button>
                </div>
                <button class="carrito-item-eliminar" data-id="${item.id}">Eliminar</button>
            `;
            carritoItemsContainer.appendChild(itemDiv);
        });

        if (totalPrecioEl) {
            totalPrecioEl.textContent = `$${total.toLocaleString('es-CL')}`;
        }
    },

    agregarEventListenersCarrito: function () {
        const carritoItemsContainer = document.getElementById('carrito-items');
        if (carritoItemsContainer) {
            carritoItemsContainer.addEventListener('click', (e) => {
                const target = e.target; 
                const id = target.dataset.id; 

                if (!id) return; 

                if (target.classList.contains('aumentar')) {
                    const item = storage.obtenerCarrito().find(p => p.id === id);
                    if (item) {
                        this.actualizarCantidad(id, item.cantidad + 1);
                    }
                } else if (target.classList.contains('disminuir')) {
                    const item = storage.obtenerCarrito().find(p => p.id === id);
                    if (item) {
                        this.actualizarCantidad(id, item.cantidad - 1);
                    }
                } else if (target.classList.contains('carrito-item-eliminar')) {
                    this.eliminarDelCarrito(id);
                }
            });
        }

        const btnFinalizarCompra = document.getElementById('finalizar-compra-btn');
        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', () => {
                this.finalizarCompra();
            });
        }
    },

    finalizarCompra: function () {
        const carritoActual = storage.obtenerCarrito();
        if (carritoActual.length === 0) {
            mostrarAlertaWeb('El carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }
        mostrarAlertaWeb('¡Compra realizada con éxito! Gracias por tu pedido.');
        storage.limpiarCarrito();
        this.actualizarVistaCarrito();
        actualizarContadorCarrito();
    }
};

if (document.getElementById('carrito-pagina')) {
    document.addEventListener('DOMContentLoaded', () => {
        carrito.actualizarVistaCarrito();
        carrito.agregarEventListenersCarrito();
    });
}