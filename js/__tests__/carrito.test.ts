import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mocks de dependencias
const guardarCarritoMock = vi.fn();
const obtenerCarritoMock = vi.fn();
const limpiarCarritoMock = vi.fn();
const obtenerUsuarioGuardadoMock = vi.fn();
const getTokenMock = vi.fn();
const agregarPedidoMock = vi.fn();
const obtenerPorIdMock = vi.fn();

vi.mock("../storage.js", () => ({
  storage: {
    obtenerUsuarioGuardado: obtenerUsuarioGuardadoMock,
    getToken: getTokenMock,
    obtenerCarrito: obtenerCarritoMock,
    guardarCarrito: guardarCarritoMock,
    limpiarCarrito: limpiarCarritoMock,
  },
  storagePedidos: {
    agregarPedido: agregarPedidoMock,
  },
}));

vi.mock("../productos.js", () => ({
  productosData: {
    obtenerPorId: obtenerPorIdMock,
  },
}));

import { carrito } from "../carrito.js";

describe("carrito", () => {
  const originalAlert = global.alert;

  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
    // Sin modal en el DOM para forzar uso de alert
    document.body.innerHTML = "";
  });

  afterEach(() => {
    global.alert = originalAlert;
  });

  it("no permite agregar si no hay token o no es CLIENTE", async () => {
    getTokenMock.mockReturnValue(null);
    obtenerUsuarioGuardadoMock.mockReturnValue({ rol: "ADMIN" });
    obtenerPorIdMock.mockResolvedValue({ id: 1, nombre: "Torta" });
    obtenerCarritoMock.mockReturnValue([]);

    await carrito.agregarAlCarrito(1, "hola");

    expect(obtenerPorIdMock).not.toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledOnce();
  });

  it("finalizarCompra devuelve sin procesar si el carrito está vacío", async () => {
    getTokenMock.mockReturnValue("token");
    obtenerUsuarioGuardadoMock.mockReturnValue({ rol: "CLIENTE", id: 9 });
    obtenerCarritoMock.mockReturnValue([]);

    await carrito.finalizarCompra(null);

    expect(agregarPedidoMock).not.toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith("Tu carrito está vacío.");
  });

  it("finalizarCompra crea pedido con mensajes y fecha", async () => {
    getTokenMock.mockReturnValue("token");
    obtenerUsuarioGuardadoMock.mockReturnValue({ rol: "CLIENTE", id: 99 });
    obtenerCarritoMock.mockReturnValue([
      { id: 7, cantidad: 2, mensaje: "sin gluten", precio: 1000 },
    ]);

    await carrito.finalizarCompra("2025-12-25");

    expect(agregarPedidoMock).toHaveBeenCalledWith({
      usuarioId: 99,
      fechaEntregaPreferida: "2025-12-25",
      items: [
        { productoId: 7, cantidad: 2, mensaje: "sin gluten" },
      ],
    });
    expect(limpiarCarritoMock).toHaveBeenCalled();
  });
});
