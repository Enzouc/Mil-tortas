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
        return productoRepo.findAll();
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return productoRepo.findById(id).orElseThrow();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Producto crear(@RequestBody Producto p) {
        return productoRepo.save(p);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto p) {
        Producto existente = productoRepo.findById(id).orElseThrow();
        existente.setNombre(p.getNombre());
        existente.setDescripcion(p.getDescripcion());
        existente.setPrecio(p.getPrecio());
        existente.setCategoria(p.getCategoria());
        existente.setTamano(p.getTamano());
        existente.setTipo(p.getTipo());
        existente.setImagen(p.getImagen());
        existente.setCodigo(p.getCodigo());
        return productoRepo.save(existente);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        productoRepo.deleteById(id);
    }
}
