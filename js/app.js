import { storage } from "./storage.js";
import { productos } from "./productos.js";
import { carrito, actualizarContadorCarrito } from "./carrito.js";
import { inicializarPerfil } from "./perfil.js";
import { validacion } from "./validacion.js";

export function mostrarAlertaWeb(mensaje) {
  const modal = document.getElementById("modal-alerta");
  const texto = document.getElementById("modal-mensaje");
  const cerrarBtn = document.getElementById("modal-cerrar");

  if (!modal || !texto || !cerrarBtn) {
    console.error("No se encontró el modal en el DOM.");
    alert(mensaje);
    return;
  }

  texto.textContent = mensaje;
  modal.classList.add("visible");

  cerrarBtn.onclick = () => {
    modal.classList.remove("visible");
  };
}

function aplicarVisibilidadPorRol() {
  const usuario = storage.obtenerUsuarioGuardado();

  const navLogin = document.getElementById("nav-login");
  const navRegistro = document.getElementById("nav-registro-perfil");
  const navPerfil = document.getElementById("nav-perfil");
  const navLogout = document.getElementById("nav-logout");
  const navAdmin = document.getElementById("nav-admin");
  const navPedidos = document.getElementById("nav-pedidos-item");
  const carritoLink = document.getElementById("carrito-link");
  const logoutBtn = document.getElementById("logout-btn");

  if (!usuario) {
    navLogin && (navLogin.style.display = "block");
    navRegistro && (navRegistro.style.display = "block");
    navPerfil && (navPerfil.style.display = "none");
    navLogout && (navLogout.style.display = "none");
    navAdmin && (navAdmin.style.display = "none");
    navPedidos && (navPedidos.style.display = "none");
    carritoLink && (carritoLink.style.display = "inline");
    if (logoutBtn) logoutBtn.onclick = null;
    return;
  }

  // Logged in
  navLogin && (navLogin.style.display = "none");
  navRegistro && (navRegistro.style.display = "none");
  navLogout && (navLogout.style.display = "block");
  if (logoutBtn) {
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      storage.limpiarUsuario();
      aplicarVisibilidadPorRol();
      window.location.href = "login.html";
    };
  }

  const rol = usuario.rol;
  if (rol === "ADMIN") {
    navPerfil && (navPerfil.style.display = "block");
    navAdmin && (navAdmin.style.display = "block");
    navPedidos && (navPedidos.style.display = "block");
    carritoLink && (carritoLink.style.display = "inline");
  } else if (rol === "VENDEDOR") {
    navPerfil && (navPerfil.style.display = "none");
    navAdmin && (navAdmin.style.display = "none");
    navPedidos && (navPedidos.style.display = "block");
    carritoLink && (carritoLink.style.display = "none");
  } else {
    // CLIENTE
    navPerfil && (navPerfil.style.display = "block");
    navAdmin && (navAdmin.style.display = "none");
    navPedidos && (navPedidos.style.display = "block");
    carritoLink && (carritoLink.style.display = "inline");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    aplicarVisibilidadPorRol();
    await actualizarContadorCarrito();

    if (document.getElementById("productos-grid")) {
      await productos.inicializar();
    }

    if (document.getElementById("carrito-pagina")) {
      carrito.actualizarVistaCarrito();
    }

    if (document.getElementById("formulario-actualizacion")) {
      await inicializarPerfil();
    }

    if (document.getElementById("formulario-registro")) {
      validacion.inicializar();
    }
  })();
});
