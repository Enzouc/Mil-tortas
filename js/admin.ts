// Obtiene el contenedor donde van las secciones
const content = document.getElementById("admin-content");

// Selecciona todos los botones del menú
const buttons = document.querySelectorAll(".admin-menu button");

// Maneja clic en cada botón
buttons.forEach(btn => {
btn.addEventListener("click", () => {
    const section = btn.getAttribute("data-section");
    cargarSeccion(section);
});
});

// Función para cargar distintas secciones
function cargarSeccion(nombre: string | null) {
if (!content) return;

switch (nombre) {
    case "dashboard":
    content.innerHTML = `
        <h2>Dashboard</h2>
        <p>Resumen general de la tienda.</p>
    `;
    break;

    case "productos":
    content.innerHTML = `
        <h2>Gestión de Productos</h2>
        <p>Aquí podrás ver, editar y eliminar productos.</p>
    `;
    break;

    case "pedidos":
    content.innerHTML = `
        <h2>Gestión de Pedidos</h2>
        <p>Aquí podrás revisar los pedidos realizados.</p>
    `;
    break;

    case "usuarios":
    content.innerHTML = `
        <h2>Gestión de Usuarios</h2>
        <p>Lista de usuarios registrados.</p>
    `;
    break;

    default:
    content.innerHTML = `
        <h2>Bienvenido al Panel Admin</h2>
        <p>Selecciona una opción del menú.</p>
    `;
}
}
