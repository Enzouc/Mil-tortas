package Miltortas.example.springboot.repositories;

import Miltortas.example.springboot.models.PedidoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoDetalleRepository extends JpaRepository<PedidoDetalle, Long> {
}
