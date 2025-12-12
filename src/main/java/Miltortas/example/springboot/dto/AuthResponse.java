package Miltortas.example.springboot.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private String token;
    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private int descuento;
    private boolean regaloCumpleDuoc;
}
