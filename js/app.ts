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


document.addEventListener('DOMContentLoaded', () => {
    void (async () => {

        const isLoginPage = window.location.pathname.includes("login");

      
        if (!isLoginPage && document.getElementById('productos-grid')) {

            productos.inicializarBotones();

            const contenedor = document.getElementById('productos-grid') as HTMLElement;
            const todos = await productosData.obtenerTodos();

            await productos.cargarProductosCliente(contenedor, todos);
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
