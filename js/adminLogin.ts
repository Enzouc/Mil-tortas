
import { storage } from './storage';

const form = document.getElementById("admin-login-form") as HTMLFormElement | null;
const errorMsg = document.getElementById("admin-error") as HTMLParagraphElement | null;

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = (document.getElementById("admin-user") as HTMLInputElement).value;
        const password = (document.getElementById("admin-pass") as HTMLInputElement).value;

        try {
            await storage.login(email, password);
            window.location.href = "admin.html";
        } catch (error) {
            console.error('Error al autenticar al administrador', error);
            if (errorMsg) errorMsg.style.display = "block";
        }
    });
}
