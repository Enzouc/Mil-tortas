import { describe, it, expect, beforeEach, vi } from "vitest";
import { validacion } from "../validacion.js";
import { auth } from "../storage.js";

const buildForm = () => {
  document.body.innerHTML = `
    <form id="formulario-registro">
      <input id="nombre" />
      <span id="error-nombre"></span>
      <input id="email" />
      <span id="error-email"></span>
      <input id="fecha-nacimiento" />
      <span id="error-fecha"></span>
      <input id="password" />
      <span id="error-password"></span>
      <input id="codigo-promocional" />
      <span id="error-codigo"></span>
      <button type="submit">Enviar</button>
    </form>
  `;
};

describe("validacion formulario de registro", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    buildForm();
  });

  it("marca error si faltan campos obligatorios", async () => {
    const form = document.getElementById("formulario-registro");
    validacion.inicializar();
    form?.dispatchEvent(new Event("submit", { cancelable: true }));

    expect(document.getElementById("error-nombre")?.textContent).toContain(
      "obligatorio"
    );
    expect(document.getElementById("error-email")?.textContent).toContain(
      "obligatorio"
    );
  });

  it("dispara registro cuando los datos son válidos", async () => {
    const spy = vi
      .spyOn(auth, "registerAndLogin")
      .mockResolvedValue({ token: "ok", usuario: { rol: "CLIENTE" } });

    document.getElementById("nombre").value = "Juan Perez";
    document.getElementById("email").value = "test@mail.com";
    document.getElementById("fecha-nacimiento").value = "2000-01-01";
    document.getElementById("password").value = "123456";
    document.getElementById("codigo-promocional").value = "";

    await validacion.validarFormularioRegistro(new Event("submit", { cancelable: true }));

    expect(spy).toHaveBeenCalledOnce();
  });
});
