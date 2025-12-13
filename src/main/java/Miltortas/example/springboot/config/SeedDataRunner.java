package Miltortas.example.springboot.config;

import Miltortas.example.springboot.models.Rol;
import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class SeedDataRunner implements ApplicationRunner {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;

    @Value("${app.admin.email:admin@duoc.cl}")
    private String adminEmail;

    @Value("${app.admin.password:Admin1234}")
    private String adminPassword;

    @Value("${app.admin.run:11111111K}")
    private String adminRun;

    public SeedDataRunner(UsuarioRepository usuarioRepo, PasswordEncoder encoder) {
        this.usuarioRepo = usuarioRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (usuarioRepo.findByCorreo(adminEmail).isPresent()) {
            return; // ya existe un admin, no sembrar
        }

        Usuario admin = new Usuario();
        admin.setRun(adminRun);
        admin.setNombre("Administrador");
        admin.setApellido("Sistema");
        admin.setCorreo(adminEmail);
        admin.setPassword(encoder.encode(adminPassword));
        admin.setRegion("Metropolitana");
        admin.setComuna("Santiago");
        admin.setDireccion("Seed Admin");
        admin.setRol(Rol.ADMIN);

        usuarioRepo.save(admin);
    }
}
