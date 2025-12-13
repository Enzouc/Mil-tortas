package Miltortas.example.springboot.controllers;

import Miltortas.example.springboot.dto.VendedorInviteRequest;
import Miltortas.example.springboot.models.Rol;
import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invitaciones")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InvitacionController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;

    @Value("${app.invite.token:change-me}")
    private String inviteToken;

    public InvitacionController(UsuarioRepository usuarioRepo, PasswordEncoder encoder) {
        this.usuarioRepo = usuarioRepo;
        this.encoder = encoder;
    }

    // Endpoint interno protegido: crear VENDEDOR mediante token de invitación y rol ADMIN
    @PostMapping("/vendedor")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario crearVendedor(@RequestBody VendedorInviteRequest req) {
        if (!inviteToken.equals(req.token())) {
            throw new RuntimeException("Token de invitación inválido");
        }

        if (usuarioRepo.findByCorreo(req.correo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario vendedor = new Usuario();
        vendedor.setRun(req.run());
        vendedor.setNombre(req.nombre());
        vendedor.setApellido(req.apellido());
        vendedor.setCorreo(req.correo());
        vendedor.setPassword(encoder.encode(req.password()));
        vendedor.setRegion(req.region());
        vendedor.setComuna(req.comuna());
        vendedor.setDireccion(req.direccion());
        vendedor.setRol(Rol.VENDEDOR);

        return usuarioRepo.save(vendedor);
    }
}
