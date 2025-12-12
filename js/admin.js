import { productos } from "./productos.js";

// --- Validación de rol ---
const usuarioString = localStorage.getItem("usuario");
if (!usuarioString) {
  window.location.href = "login.html";
}
const usuario = usuarioString ? JSON.parse(usuarioString) : null;
if (!usuario || usuario.rol !== "ADMIN") {
  window.location.href = "login.html";
}

// --- Elementos ---
const content = document.getElementById("admin-content");
const botones = document.querySelectorAll(".nav-bottom a");

// --- Navegación ---
botones.forEach((btn) => {
  btn.addEventListener("click", () => {
    botones.forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");

    const section = btn.getAttribute("data-section");
    cargarSeccion(section);
  });
});

// --- Cargar secciones ---
function cargarSeccion(nombre) {
  if (!content) return;

  switch (nombre) {
    case "dashboard":
      content.innerHTML = `
                <h2>Dashboard</h2>
                <p>Vista general.</p>
            `;
      break;

    case "productos":
      productos.inicializar();
      break;

    case "usuarios":
      content.innerHTML = "<h2>Gestión de Usuarios</h2>";
      break;

    case "pedidos":
      content.innerHTML = "<h2>Gestión de Pedidos</h2>";
      break;

    default:
      content.innerHTML = "<h2>Bienvenido Admin</h2>";
  }
}

// Cargar dashboard al iniciar
cargarSeccion("dashboard");

// --- Logout ---
document.getElementById("admin-logout")?.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  window.location.href = "login.html";
});
