package Miltortas.example.springboot.repositories;

import Miltortas.example.springboot.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
