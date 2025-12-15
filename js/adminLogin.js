import { auth } from "./storage.js";

const form = document.getElementById("admin-login-form");
const errorMsg = document.getElementById("admin-error");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userEl = document.getElementById("admin-user");
    const passEl = document.getElementById("admin-pass");

    const username = userEl && "value" in userEl ? userEl.value.trim() : "";
    const password = passEl && "value" in passEl ? passEl.value.trim() : "";

    const resultado = await auth.loginPorNombre(username, password);

    if (!resultado || !resultado.token || resultado.usuario?.rol !== "ADMIN") {
      if (errorMsg) errorMsg.style.display = "block";
      return;
    }

    window.location.href = "admin.html";
  });
}
