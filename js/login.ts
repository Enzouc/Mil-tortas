import { storage } from "./storage.js";
import { mostrarAlertaWeb } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formulario-login") as HTMLFormElement;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = (document.getElementById("correo") as HTMLInputElement).value.trim();
        const password = (document.getElementById("password") as HTMLInputElement).value.trim();

        if (!correo || !password) {
            mostrarAlertaWeb("Debes llenar todos los campos.");
            return;
        }

        try {
            const resultado = await storage.login(correo, password);

            if (!resultado || !resultado.token || !resultado.usuario) {
                mostrarAlertaWeb("Correo o contraseña incorrectos.");
                return;
            }

            localStorage.setItem("token", resultado.token);
            localStorage.setItem("usuario", JSON.stringify(resultado.usuario));

            const rol = resultado.usuario.rol;

            mostrarAlertaWeb("Inicio de sesión exitoso. Redirigiendo...");

            setTimeout(() => {
                if (rol === "ADMIN") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "perfil.html";
                }
            }, 1200);

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            mostrarAlertaWeb("Error al conectar con el servidor.");
        }
    });

});
