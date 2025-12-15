import { storage } from "./storage.js";
import { carrito, actualizarContadorCarrito } from "./carrito.js";
import { inicializarPerfil } from "./perfil.js";
import { validacion } from "./validacion.js";
import { productos } from "./productos.js";
import { showAlert } from "./alertas.js";

export function mostrarAlertaWeb(mensaje) {
  showAlert(mensaje);
}

function aplicarVisibilidadPorRol() {
  let usuario = storage.obtenerUsuarioGuardado();

  const navLogin = document.getElementById("nav-login");
  const navRegistro = document.getElementById("nav-registro-perfil");
  const navPerfil = document.getElementById("nav-perfil");
  const navLogout = document.getElementById("nav-logout");
  const navAdmin = document.getElementById("nav-admin");
  const navVendedor = document.getElementById("nav-vendedor");
  const navPedidos = document.getElementById("nav-pedidos-item");
  const carritoLink = document.getElementById("carrito-link");
  const logoutBtn = document.getElementById("logout-btn");

  if (!usuario) {
    navLogin && (navLogin.style.display = "block");
    navRegistro && (navRegistro.style.display = "block");
    navPerfil && (navPerfil.style.display = "none");
    navLogout && (navLogout.style.display = "none");
    navAdmin && (navAdmin.style.display = "none");
    navVendedor && (navVendedor.style.display = "none");
    navPedidos && (navPedidos.style.display = "none");
    carritoLink && (carritoLink.style.display = "inline");
    if (logoutBtn) logoutBtn.onclick = null;
    return;
  }

  // Logged in
  navLogin && (navLogin.style.display = "none");
  navRegistro && (navRegistro.style.display = "none");
  navLogout && (navLogout.style.display = "block");
  navPerfil && (navPerfil.style.display = "block");
  navAdmin && (navAdmin.style.display = "none");
  navVendedor && (navVendedor.style.display = "none");
  navPedidos && (navPedidos.style.display = "block");
  carritoLink && (carritoLink.style.display = "inline");
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
    navAdmin && (navAdmin.style.display = "block");
    navPedidos && (navPedidos.style.display = "none");
    // admin no compra
    carritoLink && (carritoLink.style.display = "none");
  } else if (rol === "VENDEDOR") {
    navAdmin && (navAdmin.style.display = "none");
    navVendedor && (navVendedor.style.display = "block");
    // vendedor no compra
    carritoLink && (carritoLink.style.display = "none");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    // Asegurar que tenemos usuario cargado si existe token
    if (!storage.obtenerUsuarioGuardado() && storage.getToken()) {
      try {
        await storage.obtenerUsuario();
      } catch (e) {
        console.warn("No se pudo refrescar usuario", e);
      }
    }

    aplicarVisibilidadPorRol();
    // Refrescar visibilidad con usuario actualizado
    const usuarioFinal = storage.obtenerUsuarioGuardado();
    const navPedidos = document.getElementById("nav-pedidos-item");
    if (usuarioFinal && navPedidos) {
      navPedidos.style.display = "block";
    }
    await actualizarContadorCarrito();

    // Redirigir a vista exclusiva de vendedor
    if (usuarioFinal?.rol === "VENDEDOR") {
      const path = window.location.pathname;
      if (!path.endsWith("/vendedor.html")) {
        window.location.href = "/vendedor.html";
        return;
      }
    }

    if (document.getElementById("productos-grid")) {
      await productos.inicializar();
    }

    if (document.getElementById("carrito-pagina")) {
      carrito.actualizarVistaCarrito();
    }

    if (document.getElementById("destacados-grid")) {
      await productos.inicializarDestacados();
    }

    if (document.getElementById("formulario-actualizacion")) {
      await inicializarPerfil();
    }

    if (document.getElementById("formulario-registro")) {
      validacion.inicializar();
    }
  })();
});
