package Miltortas.example.springboot.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {

    private String run;
    private String nombre;
    private String apellido;
    private String correo;
    private String password;

    private String region;
    private String comuna;
    private String direccion;
    private String fechaNacimiento; 

    private String rol;
    private String codigoPromocional;
}
