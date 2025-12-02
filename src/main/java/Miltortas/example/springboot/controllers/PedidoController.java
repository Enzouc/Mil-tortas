package Miltortas.example.springboot.controllers;
import Miltortas.example.springboot.dto.CrearPedidoDTO;
import Miltortas.example.springboot.models.*;
import Miltortas.example.springboot.repositories.PedidoRepository;
import Miltortas.example.springboot.repositories.ProductoRepository;
import Miltortas.example.springboot.repositories.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private ProductoRepository productoRepo;

    @PostMapping
    public Pedido crearPedido(@RequestBody CrearPedidoDTO dto) {

        Usuario usuario = usuarioRepo.findById(dto.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        AtomicInteger total = new AtomicInteger(0);

        List<PedidoDetalle> detalles = dto.items().stream().map(item -> {

            Producto producto = productoRepo.findById(item.productoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.productoId()));

            PedidoDetalle d = new PedidoDetalle();
            d.setProducto(producto);
            d.setCantidad(item.cantidad());
            d.setPrecioUnitario(producto.getPrecio());
            d.setPedido(pedido);

            total.addAndGet(producto.getPrecio() * item.cantidad());

            return d;
        }).collect(Collectors.toList());

        pedido.setDetalles(detalles);
        pedido.setTotal(total.get());

        return pedidoRepo.save(pedido);
    }

    @GetMapping
    public List<Pedido> obtenerPedidos() {
        return pedidoRepo.findAll();
    }

    @GetMapping("/{id}")
    public Pedido obtenerPorId(@PathVariable Long id) {
        return pedidoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }
}
