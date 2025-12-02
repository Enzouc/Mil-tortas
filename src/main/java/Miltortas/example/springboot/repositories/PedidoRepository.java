package Miltortas.example.springboot.repositories;

import Miltortas.example.springboot.models.Pedido;
import Miltortas.example.springboot.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuario(Usuario usuario);

}
