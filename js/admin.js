import { productosApi, usuariosApi } from "./storage.js";
import { storagePedidos } from "./storage.js";

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
const sectionTitle = document.getElementById("admin-section-title");
const botones = document.querySelectorAll(".nav-bottom a");
const categorias = [
  "Tortas Cuadradas",
  "Tortas Circulares",
  "Postres Individuales",
  "Productos Sin Azúcar",
  "Pastelería Tradicional",
  "Productos Sin Gluten",
  "Productos Veganos",
  "Tortas Especiales",
];
let regiones = {};

async function cargarRegionesDesdeApi() {
  const resp = await fetch("http://localhost:8080/api/regiones");
  if (!resp.ok) throw new Error("No se pudieron obtener regiones");
  regiones = await resp.json();
}


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
      if (sectionTitle) sectionTitle.textContent = "Dashboard";
      renderDashboard();
      break;

    case "productos":
      if (sectionTitle) sectionTitle.textContent = "Productos";
      renderProductosAdmin();
      break;

    case "usuarios":
      if (sectionTitle) sectionTitle.textContent = "Usuarios";
      renderUsuariosAdmin();
      break;

    case "pedidos":
      if (sectionTitle) sectionTitle.textContent = "Pedidos";
      renderPedidosAdmin();
      break;

    default:
      if (sectionTitle) sectionTitle.textContent = "Panel Admin";
      content.innerHTML = "<h2>Bienvenido Admin</h2>";
  }
}

// Cargar dashboard al iniciar
cargarRegionesDesdeApi()
  .then(() => cargarSeccion("dashboard"))
  .catch((e) => {
    console.error("No se pudieron cargar las regiones desde el backend.", e);
    content.innerHTML =
      "<p>Error al cargar las regiones. Verifique el backend.</p>";
  });

// --- Logout ---
  document.getElementById("admin-logout")?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

async function renderDashboard() {
  if (!content) return;

  content.innerHTML = "<p>Cargando dashboard...</p>";

  let productos = [];
  let usuarios = [];
  let pedidos = [];

  try {
    [productos, usuarios, pedidos] = await Promise.all([
      productosApi.obtenerTodos(),
      usuariosApi.obtenerTodos(),
      storagePedidos.obtenerPedidos(true),
    ]);
  } catch (err) {
    console.error("No se pudo cargar el dashboard", err);
    content.innerHTML = "<p>Error al cargar el dashboard.</p>";
    return;
  }

  const stockCritico = productos.filter(
    (p) => p.stockCritico != null && p.stock <= p.stockCritico
  );

  const pedidosRecientes = (pedidos || []).slice(0, 5);

  const rolCount = usuarios.reduce(
    (acc, u) => {
      acc[u.rol] = (acc[u.rol] || 0) + 1;
      return acc;
    },
    { ADMIN: 0, VENDEDOR: 0, CLIENTE: 0 }
  );

  content.innerHTML = `
    <div class="dashboard-grid">
      <div class="card kpi">
        <h3>Pedidos</h3>
        <p>Total: ${pedidos.length || 0}</p>
        <p>Recientes: ${pedidosRecientes.length}</p>
      </div>
      <div class="card kpi">
        <h3>Usuarios</h3>
        <p>Admins: ${rolCount.ADMIN || 0}</p>
        <p>Vendedores: ${rolCount.VENDEDOR || 0}</p>
        <p>Clientes: ${rolCount.CLIENTE || 0}</p>
      </div>
      <div class="card kpi">
        <h3>Stock Crítico</h3>
        <p>${stockCritico.length} productos</p>
      </div>
    </div>

    <div class="card">
      <h3>Pedidos recientes</h3>
      <ul class="lista-simple">
        ${
          pedidosRecientes.length === 0
            ? "<li>Sin pedidos</li>"
            : pedidosRecientes
                .map(
                  (p) =>
                    `<li>#${p.id} - Total $${p.total || 0} - ${p.estado || "Pendiente"}</li>`
                )
                .join("")
        }
      </ul>
    </div>

    <div class="card">
      <h3>Stock crítico</h3>
      <ul class="lista-simple">
        ${
          stockCritico.length === 0
            ? "<li>Sin alertas</li>"
            : stockCritico
                .map(
                  (p) =>
                    `<li>${p.nombre} (Stock: ${p.stock}, Crítico: ${p.stockCritico})</li>`
                )
                .join("")
        }
      </ul>
    </div>
  `;
}

async function renderProductosAdmin() {
  if (!content) return;
  const lista = await productosApi.obtenerTodos();
  content.innerHTML = `
    <h2>Gestión de Productos</h2>
    <div class="admin-section">
      <form id="producto-form" class="formulario">
        <h3>Crear producto</h3>
        <input id="p-nombre" placeholder="Nombre" maxlength="100" required />
        <input id="p-codigo" placeholder="Código (min 3)" minlength="3" required />
        <input id="p-descripcion" placeholder="Descripción (max 500)" maxlength="500" />
        <input id="p-precio" type="number" step="0.01" min="0" placeholder="Precio" required />
        <input id="p-stock" type="number" min="0" step="1" placeholder="Stock" required />
        <input id="p-stock-critico" type="number" min="0" step="1" placeholder="Stock crítico" />
        <select id="p-categoria" required>
          <option value="">Categoría</option>
          ${categorias.map((c) => `<option value="${c}">${c}</option>`).join("")}
        </select>
        <select id="p-tamano" required>
          <option value="">Tamaño</option>
          <option value="pequena">Individual</option>
          <option value="mediana">Mediana</option>
          <option value="grande">Grande</option>
        </select>
        <input id="p-imagen" placeholder="URL imagen" />
        <button type="submit">Crear / Actualizar</button>
      </form>
      <div id="productos-admin-list">
        ${lista
          .map(
            (p) => `
          <div class="admin-card">
            <strong>${p.nombre}</strong> (${p.categoria}) - $${p.precio} - ${p.tamano || ""}
            <button data-edit="${p.id}" class="btn">Editar</button>
            <button data-del="${p.id}" class="btn-peligro">Eliminar</button>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  let editId = null;

  const form = document.getElementById("producto-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const validar = () => {
      const codigo = document.getElementById("p-codigo").value;
      const nombre = document.getElementById("p-nombre").value;
      const descripcion = document.getElementById("p-descripcion").value;
      const precio = Number(document.getElementById("p-precio").value);
      const stock = Number(document.getElementById("p-stock").value);
      const stockCriticoVal = document.getElementById("p-stock-critico").value;
      const stockCritico = stockCriticoVal === "" ? null : Number(stockCriticoVal);
      const categoria = document.getElementById("p-categoria").value;
      const tamano = document.getElementById("p-tamano").value;
      const imagenUrl = document.getElementById("p-imagen").value;

      if (codigo.length < 3) throw new Error("Código mínimo 3 caracteres");
      if (!nombre || nombre.length > 100) throw new Error("Nombre requerido (max 100)");
      if (descripcion && descripcion.length > 500) throw new Error("Descripción max 500");
      if (isNaN(precio) || precio < 0) throw new Error("Precio inválido (>=0)");
      if (!Number.isInteger(stock) || stock < 0) throw new Error("Stock entero >=0");
      if (stockCritico !== null && (!Number.isInteger(stockCritico) || stockCritico < 0))
        throw new Error("Stock crítico entero >=0");
      if (!categoria) throw new Error("Categoría requerida");
      if (!tamano) throw new Error("Tamaño requerido");

      return {
        nombre,
        codigo,
        descripcion,
        precio,
        stock,
        stockCritico,
        categoria,
        tamano,
        imagenUrl,
      };
    };

    const nuevo = {
      ...validar(),
    };

    if (editId) {
      await productosApi.actualizarProducto(editId, nuevo);
      editId = null;
    } else {
      await productosApi.crearProducto(nuevo);
    }
    renderProductosAdmin();
  });

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit");
      const prod = lista.find((p) => String(p.id) === String(id));
      if (!prod) return;
      editId = id;
      document.getElementById("p-nombre").value = prod.nombre || "";
      document.getElementById("p-codigo").value = prod.codigo || "";
      document.getElementById("p-descripcion").value = prod.descripcion || "";
      document.getElementById("p-precio").value = prod.precio;
      document.getElementById("p-stock").value = prod.stock;
      document.getElementById("p-stock-critico").value = prod.stockCritico ?? "";
      document.getElementById("p-categoria").value = prod.categoria || "";
      document.getElementById("p-tamano").value = prod.tamano || "";
      document.getElementById("p-imagen").value = prod.imagenUrl || "";
    });
  });

  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-del");
      await productosApi.eliminarProducto(id);
      renderProductosAdmin();
    });
  });
}

async function renderUsuariosAdmin() {
  if (!content) return;
  const usuarios = await usuariosApi.obtenerTodos();
  content.innerHTML = `
    <h2>Gestión de Usuarios</h2>
    <form id="usuario-form" class="formulario">
      <h3>Crear usuario</h3>
      <input id="u-run" placeholder="RUN sin puntos ni guion" required minlength="7" maxlength="9" />
      <input id="u-nombre" placeholder="Nombre (max 50)" maxlength="50" required />
      <input id="u-apellido" placeholder="Apellido (max 100)" maxlength="100" required />
      <input id="u-correo" placeholder="Correo duoc.cl / profesor.duoc.cl / gmail.com" required />
      <input id="u-password" type="password" placeholder="Password" required />
      <input id="u-fecha" type="date" placeholder="Fecha Nacimiento (opcional)" />
      <select id="u-region" required>
        <option value="">Región</option>
        ${Object.keys(regiones)
          .map((r) => `<option value="${r}">${r}</option>`)
          .join("")}
      </select>
      <select id="u-comuna" required>
        <option value="">Comuna</option>
      </select>
      <input id="u-direccion" placeholder="Dirección (max 300)" maxlength="300" required />
      <select id="u-rol" required>
        <option value="CLIENTE">CLIENTE</option>
        <option value="VENDEDOR">VENDEDOR</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button type="submit">Crear usuario</button>
    </form>
    <div id="usuarios-admin-list">
      ${usuarios
        .map(
          (u) => `
        <div class="admin-card">
          <div>
            <strong>${u.nombre} ${u.apellido}</strong> (${u.correo})
            <div>Rol:
              <select data-user="${u.id}">
                <option value="ADMIN" ${u.rol === "ADMIN" ? "selected" : ""}>ADMIN</option>
                <option value="VENDEDOR" ${u.rol === "VENDEDOR" ? "selected" : ""}>VENDEDOR</option>
                <option value="CLIENTE" ${u.rol === "CLIENTE" ? "selected" : ""}>CLIENTE</option>
              </select>
            </div>
          </div>
          <button data-del-user="${u.id}" class="btn-peligro">Eliminar</button>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  const regionSelect = document.getElementById("u-region");
  const comunaSelect = document.getElementById("u-comuna");
  regionSelect?.addEventListener("change", () => {
    const reg = regionSelect.value;
    const comunas = regiones[reg] || [];
    comunaSelect.innerHTML = '<option value=\"\">Comuna</option>' + comunas.map((c) => `<option value="${c}">${c}</option>`).join("");
  });

  const form = document.getElementById("usuario-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const run = document.getElementById("u-run").value.trim();
    const nombre = document.getElementById("u-nombre").value.trim();
    const apellido = document.getElementById("u-apellido").value.trim();
    const correo = document.getElementById("u-correo").value.trim();
    const password = document.getElementById("u-password").value;
    const fechaNacimiento = document.getElementById("u-fecha").value || null;
    const region = document.getElementById("u-region").value;
    const comuna = document.getElementById("u-comuna").value;
    const direccion = document.getElementById("u-direccion").value.trim();
    const rol = document.getElementById("u-rol").value;

    if (run.length < 7 || run.length > 9) throw new Error("RUN inválido (7-9)");
    if (!nombre || nombre.length > 50) throw new Error("Nombre inválido");
    if (!apellido || apellido.length > 100) throw new Error("Apellido inválido");
    if (!region || !comuna) throw new Error("Región y comuna requeridas");
    if (!direccion || direccion.length > 300) throw new Error("Dirección inválida");

    await usuariosApi.crear({
      run,
      nombre,
      apellido,
      correo,
      password,
      fechaNacimiento,
      region,
      comuna,
      direccion,
      rol,
    });
    renderUsuariosAdmin();
  });

  document.querySelectorAll("select[data-user]").forEach((sel) => {
    sel.addEventListener("change", async () => {
      const id = sel.getAttribute("data-user");
      const rol = sel.value;
      await usuariosApi.actualizar(id, { rol });
    });
  });

  document.querySelectorAll("[data-del-user]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-del-user");
      await usuariosApi.eliminar(id);
      renderUsuariosAdmin();
    });
  });
}

async function renderPedidosAdmin() {
  if (!content) return;
  content.innerHTML = "<p>Cargando pedidos...</p>";
  try {
    const pedidos = await storagePedidos.obtenerPedidos(true);
    content.innerHTML = `
      <h2>Gestión de Pedidos</h2>
      <div id="pedidos-admin-list">
        ${
          pedidos && pedidos.length
            ? pedidos
                .map((p) => {
                  const detalles = (p.detalles || []).map(
                    (d) =>
                      `<li>${d.nombre || d.producto?.nombre || ""} x ${d.cantidad} ($${d.precioUnitario || 0})</li>`
                  ).join("");
                  return `
                  <div class="admin-card">
                    <div><strong>Pedido #${p.id}</strong> - Total: $${p.total || 0}</div>
                    <div>Estado: ${p.estado || "Pendiente"}</div>
                    <ul class="lista-simple">${detalles}</ul>
                  </div>
                `;
                })
                .join("")
            : "<p>Sin pedidos.</p>"
        }
      </div>
    `;
  } catch (err) {
    console.error(err);
    content.innerHTML = "<p>Error cargando pedidos.</p>";
  }
}
