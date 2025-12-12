package Miltortas.example.springboot.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 9, unique = true)
    private String run; 

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    private String password;

    private LocalDate fechaNacimiento; 

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private String comuna;

    @Column(nullable = false, length = 300)
    private String direccion;

    // --- BENEFICIOS Y PLANES ---
    private Integer descuento = 0;
    private boolean regaloCumpleDuoc = false;

    @Enumerated(EnumType.STRING)
    private Rol rol;
}
