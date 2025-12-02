package Miltortas.example.springboot.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String correo;
    private String password;
    private String codigoPromocional;
    private String rol;
}
