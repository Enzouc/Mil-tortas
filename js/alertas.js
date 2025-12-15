// Utilidad centralizada para mostrar alertas modales con el estilo global
function ensureModalStyles() {
  const existing = document.querySelector('link[href*="css/modal.css"]');
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/css/modal.css";
  document.head.appendChild(link);
}

function ensureModalAlerta() {
  let modal = document.getElementById("modal-alerta");
  let texto = document.getElementById("modal-mensaje");
  let cerrarBtn = document.getElementById("modal-cerrar");

  if (!modal || !texto || !cerrarBtn) {
    modal = document.createElement("div");
    modal.id = "modal-alerta";
    modal.className = "modal";

    const contenido = document.createElement("div");
    contenido.className = "modal-contenido";

    texto = document.createElement("p");
    texto.id = "modal-mensaje";

    cerrarBtn = document.createElement("button");
    cerrarBtn.id = "modal-cerrar";
    cerrarBtn.textContent = "Cerrar";

    contenido.appendChild(texto);
    contenido.appendChild(cerrarBtn);
    modal.appendChild(contenido);
    document.body.appendChild(modal);
  }

  return { modal, texto, cerrarBtn };
}

export function showAlert(mensaje) {
  ensureModalStyles();
  const { modal, texto, cerrarBtn } = ensureModalAlerta();
  texto.textContent = mensaje;
  modal.classList.add("visible");
  cerrarBtn.onclick = () => modal.classList.remove("visible");
}
