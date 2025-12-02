import { storage } from './storage';

const form = document.getElementById("admin-login-form") as HTMLFormElement | null;
const errorMsg = document.getElementById("admin-error") as HTMLParagraphElement | null;

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = (document.getElementById("admin-user") as HTMLInputElement).value.trim();
        const password = (document.getElementById("admin-pass") as HTMLInputElement).value.trim();

        const resultado = await storage.loginPorNombre(username, password);

        if (!resultado || !resultado.token || resultado.usuario?.rol !== "ADMIN") {
            if (errorMsg) errorMsg.style.display = "block";
            return;
        }

        window.location.href = "admin.html";
    });
}
