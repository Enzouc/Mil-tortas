package Miltortas.example.springboot.controllers;

import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> getUsuarios() {
        return usuarioRepo.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario getUsuario(@PathVariable Long id) {
        return usuarioRepo.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        usuarioRepo.deleteById(id);
    }

    @GetMapping("/me")
    public Usuario verMiPerfil(org.springframework.security.core.Authentication auth) {
        return usuarioRepo.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR','CLIENTE')")
    public Usuario actualizarMiPerfil(org.springframework.security.core.Authentication auth,
                                      @RequestBody Usuario datos) {
        Usuario actual = usuarioRepo.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo campos editables por el usuario
        if (datos.getNombre() != null) actual.setNombre(datos.getNombre());
        if (datos.getApellido() != null) actual.setApellido(datos.getApellido());
        if (datos.getRegion() != null) actual.setRegion(datos.getRegion());
        if (datos.getComuna() != null) actual.setComuna(datos.getComuna());
        if (datos.getDireccion() != null) actual.setDireccion(datos.getDireccion());
        if (datos.getFechaNacimiento() != null) actual.setFechaNacimiento(datos.getFechaNacimiento());

        return usuarioRepo.save(actual);
    }
}
