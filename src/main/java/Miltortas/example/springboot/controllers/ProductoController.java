package Miltortas.example.springboot.controllers;

import Miltortas.example.springboot.models.Producto;
import Miltortas.example.springboot.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepo;

    @GetMapping
    public List<Producto> listar() {
        List<Producto> productos = productoRepo.findAll();

        productos.forEach(p -> {
            if (p.getStockCritico() != null && p.getStock() <= p.getStockCritico()) {
                System.out.println("ALERTA: STOCK CRITICO para " + p.getNombre()
                        + " (Stock: " + p.getStock() + ")");
            }
        });

        return productos;
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        validarProducto(producto);
        return productoRepo.save(producto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto p) {

        Producto ex = productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        validarProducto(p);

        ex.setCodigo(p.getCodigo());
        ex.setNombre(p.getNombre());
        ex.setDescripcion(p.getDescripcion());
        ex.setPrecio(p.getPrecio());
        ex.setStock(p.getStock());
        ex.setStockCritico(p.getStockCritico());
        ex.setCategoria(p.getCategoria());
        ex.setImagenUrl(p.getImagenUrl());
        ex.setTamano(p.getTamano());

        return productoRepo.save(ex);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        productoRepo.deleteById(id);
    }

    private void validarProducto(Producto p) {

        if (p.getCodigo() == null || p.getCodigo().length() < 3)
            throw new RuntimeException("Codigo debe tener minimo 3 caracteres.");

        if (p.getNombre() == null || p.getNombre().length() > 100)
            throw new RuntimeException("Nombre requerido (max 100).");

        if (p.getDescripcion() != null && p.getDescripcion().length() > 500)
            throw new RuntimeException("Descripcion max 500 caracteres.");

        if (p.getPrecio() < 0)
            throw new RuntimeException("Precio no puede ser negativo.");

        if (p.getStock() < 0)
            throw new RuntimeException("Stock no puede ser menor a 0.");

        if (p.getStockCritico() != null && p.getStockCritico() < 0)
            throw new RuntimeException("Stock critico no puede ser negativo.");

        if (p.getCategoria() == null)
            throw new RuntimeException("Categoria obligatoria.");

        if (p.getTamano() == null || p.getTamano().isBlank())
            throw new RuntimeException("Tamaño obligatorio (pequena/mediana/grande).");
    }
}
