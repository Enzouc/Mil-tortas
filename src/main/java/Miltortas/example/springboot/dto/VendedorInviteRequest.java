package Miltortas.example.springboot.dto;

public record VendedorInviteRequest(
        String token,
        String run,
        String nombre,
        String apellido,
        String correo,
        String password,
        String region,
        String comuna,
        String direccion,
        String fechaNacimiento
) {
}
