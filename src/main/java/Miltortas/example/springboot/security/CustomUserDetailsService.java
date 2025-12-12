package Miltortas.example.springboot.security;

import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepo;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepo.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("❌ No existe usuario con ese correo"));

        return new UsuarioUserDetails(usuario); // 👈 así sí retorna UserDetails correctamente
    }
}
