
const form = document.getElementById("admin-login-form") as HTMLFormElement | null;
const errorMsg = document.getElementById("admin-error") as HTMLParagraphElement | null;

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const user = (document.getElementById("admin-user") as HTMLInputElement).value;
        const pass = (document.getElementById("admin-pass") as HTMLInputElement).value;

        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            localStorage.setItem("admin", "true");
            window.location.href = "admin.html";
        } else {
            if (errorMsg) errorMsg.style.display = "block";
        }
    });
}
