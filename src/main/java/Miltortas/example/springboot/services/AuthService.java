package Miltortas.example.springboot.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Miltortas.example.springboot.dto.AuthRequest;
import Miltortas.example.springboot.dto.AuthResponse;
import Miltortas.example.springboot.dto.RegisterRequest;
import Miltortas.example.springboot.dto.UsuarioDTO;

import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.models.Rol;

import Miltortas.example.springboot.repositories.UsuarioRepository;
import Miltortas.example.springboot.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public AuthResponse login(AuthRequest request) {

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtService.generarToken(usuario);

        UsuarioDTO usuarioDTO = new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );

        return AuthResponse.builder()
                .token(token)
                .usuario(usuarioDTO)
                .build();
    }


    public AuthResponse register(RegisterRequest request) {

       
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.valueOf(request.getRol())); 

        usuarioRepository.save(usuario);

        String token = jwtService.generarToken(usuario);

        UsuarioDTO usuarioDTO = new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );

        return AuthResponse.builder()
                .token(token)
                .usuario(usuarioDTO)
                .build();
    }
}
