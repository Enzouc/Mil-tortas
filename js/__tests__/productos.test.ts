import { describe, it, expect, beforeEach } from "vitest";
import { productos } from "../productos.js";

const baseProductos = [
  {
    id: "1",
    nombre: "Torta A",
    descripcion: "Desc A",
    precio: 1000,
    imagen: "/img/a.jpg",
    categoria: "Cat1",
    tamano: "grande",
  },
  {
    id: "2",
    nombre: "Torta B",
    descripcion: "Desc B",
    precio: 2000,
    imagen: "/img/b.jpg",
    categoria: "Cat2",
    tamano: "pequena",
  },
];

describe("productos.renderizar", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="productos-grid"></div>';
    productos.productosCache = [...baseProductos];
    productos.categoriaActual = "todos";
    productos.tamanoActual = "todos";
  });

  it("muestra todos los productos sin filtros", () => {
    productos.renderizar();
    const cards = document.querySelectorAll(".producto-card");
    expect(cards.length).toBe(2);
  });

  it("filtra por categoría y tamaño", () => {
    productos.categoriaActual = "Cat1";
    productos.tamanoActual = "grande";
    productos.renderizar();
    const cards = document.querySelectorAll(".producto-card");
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain("Torta A");
  });

  it("muestra mensaje cuando no hay resultados", () => {
    productos.categoriaActual = "NoExiste";
    productos.renderizar();
    expect(document.getElementById("productos-grid")?.textContent).toContain(
      "No hay productos"
    );
  });
});
