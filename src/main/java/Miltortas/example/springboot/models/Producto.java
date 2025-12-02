package Miltortas.example.springboot.models;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;     
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    private Integer precio;    

    private String categoria;
    private String tipo;       
    private String tamano;     
    private String imagen;
}
