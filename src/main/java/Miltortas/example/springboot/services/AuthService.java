package Miltortas.example.springboot.services;

import Miltortas.example.springboot.dto.AuthRequest;
import Miltortas.example.springboot.dto.AuthResponse;
import Miltortas.example.springboot.dto.RegisterRequest;
import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.models.Rol;
import Miltortas.example.springboot.repositories.UsuarioRepository;
import Miltortas.example.springboot.security.JwtService;
import Miltortas.example.springboot.security.UsuarioUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    // ==================================================================
    //                        REGISTRO USUARIO
    // ==================================================================
    public AuthResponse register(RegisterRequest req) {

        if(usuarioRepo.findByCorreo(req.getCorreo()).isPresent())
            throw new RuntimeException("El correo ya está registrado");

        // ========== VALIDACIONES ==========
        if(req.getRun() == null || req.getRun().length() < 7 || req.getRun().length() > 9)
            throw new RuntimeException("RUN inválido. Formato: 19011022K (sin guion ni puntos)");

        if(req.getNombre() == null || req.getNombre().length() > 50)
            throw new RuntimeException("Nombre obligatorio (max 50)");

        if(req.getApellido() == null || req.getApellido().length() > 100)
            throw new RuntimeException("Apellido obligatorio (max 100)");

        if(!req.getCorreo().matches("^[A-Za-z0-9._%+-]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$"))
            throw new RuntimeException("Correo no válido. Solo duoc.cl / profesor.duoc.cl / gmail.com");

        if(req.getRegion() == null) throw new RuntimeException("Debe seleccionar Región");
        if(req.getComuna() == null) throw new RuntimeException("Debe seleccionar Comuna");

        if(req.getDireccion() == null || req.getDireccion().length() > 300)
            throw new RuntimeException("Dirección obligatoria (max 300)");

        // ===============================================================
        //                   CREACIÓN DE USUARIO FINAL
        // ===============================================================
        Usuario user = new Usuario();
        user.setRun(req.getRun());
        user.setNombre(req.getNombre());
        user.setApellido(req.getApellido());
        user.setCorreo(req.getCorreo());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRegion(req.getRegion());
        user.setComuna(req.getComuna());
        user.setDireccion(req.getDireccion());
        user.setRol(Rol.CLIENTE); // por defecto cliente

        // Fecha opcional
        if(req.getFechaNacimiento() != null && !req.getFechaNacimiento().isEmpty())
            user.setFechaNacimiento(LocalDate.parse(req.getFechaNacimiento()));


        // ====================== BENEFICIOS ======================

        // 1) Mayores de 50 años -> 50% descuento permanente
        if(user.getFechaNacimiento() != null){
            int edad = Period.between(user.getFechaNacimiento(), LocalDate.now()).getYears();
            if(edad >= 50) user.setDescuento(50);
        }

        // 2) Código "FELICES50" -> 10% descuento permanente (sin bajar un beneficio mayor)
        if(req.getCodigoPromocional() != null &&
                req.getCodigoPromocional().equalsIgnoreCase("FELICES50")){
            int beneficioActual = user.getDescuento() != null ? user.getDescuento() : 0;
            user.setDescuento(Math.max(beneficioActual, 10));
        }

        // 3) Correo DUOC + cumpleaños -> Pedido gratis
        if(req.getCorreo().endsWith("@duoc.cl"))
            user.setRegaloCumpleDuoc(true);


        usuarioRepo.save(user);

        // ====================== LOGIN AUTOMÁTICO ======================
        UsuarioUserDetails details = new UsuarioUserDetails(user);
        String token = jwt.generarToken(details);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .nombre(user.getNombre()+" "+user.getApellido())
                .correo(user.getCorreo())
                .rol(user.getRol().name())
                .descuento(user.getDescuento())
                .regaloCumpleDuoc(user.isRegaloCumpleDuoc())
                .build();
    }


    // ==================================================================
    //                             LOGIN
    // ==================================================================
    public AuthResponse login(AuthRequest req) {

        Usuario user = usuarioRepo.findByCorreo(req.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if(!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Contraseña incorrecta");

        UsuarioUserDetails details = new UsuarioUserDetails(user);
        String token = jwt.generarToken(details);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .nombre(user.getNombre()+" "+user.getApellido())
                .correo(user.getCorreo())
                .rol(user.getRol().name())
                .descuento(user.getDescuento())
                .regaloCumpleDuoc(user.isRegaloCumpleDuoc())
                .build();
    }
}
