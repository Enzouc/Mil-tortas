package Miltortas.example.springboot.controllers;

import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario crearUsuario(@RequestBody Usuario data) {
        validarUsuario(data, true);
        data.setPassword(passwordEncoder.encode(data.getPassword()));
        return usuarioRepo.save(data);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario actualizar(@PathVariable Long id, @RequestBody Usuario data) {
        Usuario usuario = usuarioRepo.findById(id).orElseThrow();

        if (data.getNombre() != null) usuario.setNombre(data.getNombre());
        if (data.getApellido() != null) usuario.setApellido(data.getApellido());
        if (data.getRegion() != null) usuario.setRegion(data.getRegion());
        if (data.getComuna() != null) usuario.setComuna(data.getComuna());
        if (data.getDireccion() != null) usuario.setDireccion(data.getDireccion());
        if (data.getRol() != null) usuario.setRol(data.getRol());

        validarUsuario(usuario, false);
        return usuarioRepo.save(usuario);
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

    private void validarUsuario(Usuario u, boolean nuevo) {
        if (u.getRun() == null || u.getRun().length() < 7 || u.getRun().length() > 9)
            throw new RuntimeException("RUN inválido (7-9 sin puntos ni guion)");
        if (!validaRun(u.getRun()))
            throw new RuntimeException("RUN inválido (dígito verificador)");
        if (u.getNombre() == null || u.getNombre().length() > 50)
            throw new RuntimeException("Nombre requerido (max 50)");
        if (u.getApellido() == null || u.getApellido().length() > 100)
            throw new RuntimeException("Apellido requerido (max 100)");
        if (u.getCorreo() == null || u.getCorreo().length() > 100 ||
                !u.getCorreo().matches("^[A-Za-z0-9._%+-]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$"))
            throw new RuntimeException("Correo inválido (duoc.cl / profesor.duoc.cl / gmail.com)");
        if (u.getRegion() == null) throw new RuntimeException("Región requerida");
        if (u.getComuna() == null) throw new RuntimeException("Comuna requerida");
        if (u.getDireccion() == null || u.getDireccion().length() > 300)
            throw new RuntimeException("Dirección requerida (max 300)");
        if (nuevo && (u.getPassword() == null || u.getPassword().isBlank()))
            throw new RuntimeException("Password requerida");
        if (u.getRol() == null)
            throw new RuntimeException("Rol requerido");
    }

    private boolean validaRun(String run) {
        String clean = run.trim().toUpperCase();
        if (!clean.matches("^[0-9]{7,8}[0-9K]$")) return false;
        String cuerpo = clean.substring(0, clean.length() - 1);
        char dv = clean.charAt(clean.length() - 1);

        int suma = 0;
        int factor = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * factor;
            factor = factor == 7 ? 2 : factor + 1;
        }
        int resto = 11 - (suma % 11);
        char dvCalc;
        if (resto == 11) dvCalc = '0';
        else if (resto == 10) dvCalc = 'K';
        else dvCalc = Character.forDigit(resto, 10);

        return dvCalc == dv;
    }
}
