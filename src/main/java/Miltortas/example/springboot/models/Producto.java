package Miltortas.example.springboot.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String codigo; 

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private double precio;

    @Column(nullable = false)
    private int stock;

    private Integer stockCritico;

    @Column(nullable = false)
    private String categoria;

    @Column(length = 20)
    private String tamano;

    private String imagenUrl;
}
