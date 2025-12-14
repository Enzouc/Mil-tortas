package Miltortas.example.springboot.controllers;

import Miltortas.example.springboot.dto.CrearPedidoDTO;
import Miltortas.example.springboot.models.Pedido;
import Miltortas.example.springboot.models.PedidoDetalle;
import Miltortas.example.springboot.models.Producto;
import Miltortas.example.springboot.models.Usuario;
import Miltortas.example.springboot.repositories.PedidoRepository;
import Miltortas.example.springboot.repositories.ProductoRepository;
import Miltortas.example.springboot.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/pedidos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PedidoController {

    @Autowired private PedidoRepository pedidoRepo;
    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private ProductoRepository productoRepo;

    // =====================================================
    //  1) SOLO CLIENTE puede crear pedidos
    // =====================================================
    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public Pedido crearPedido(@RequestBody CrearPedidoDTO dto) {

        Usuario usuario = usuarioRepo.findById(dto.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        AtomicInteger total = new AtomicInteger(0);

        // ---------------- Items del pedido ----------------
        List<PedidoDetalle> detalles = dto.items().stream().map(item -> {

            Producto producto = productoRepo.findById(item.productoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado (ID: " + item.productoId() + ")"));

            PedidoDetalle d = new PedidoDetalle();
            d.setProducto(producto);
            d.setCantidad(item.cantidad());
            d.setPrecioUnitario(producto.getPrecio());
            d.setMensajePersonal(item.mensaje());
            d.setPedido(pedido);

            total.addAndGet((int) (producto.getPrecio() * item.cantidad()));

            return d;
        }).collect(Collectors.toList());

        pedido.setDetalles(detalles);

        // =====================================================
        //  2) Beneficios / descuentos / regalo cumpleaños DUOC
        // =====================================================
        int subtotal = total.get();
        Integer beneficio = usuario.getDescuento();

        // Fecha de entrega y seguimiento
        if (dto.fechaEntregaPreferida() != null && !dto.fechaEntregaPreferida().isBlank()) {
            try {
                pedido.setFechaEntrega(LocalDate.parse(dto.fechaEntregaPreferida()));
            } catch (Exception e) {
                pedido.setFechaEntrega(LocalDate.now().plusDays(1));
            }
        } else {
            pedido.setFechaEntrega(LocalDate.now().plusDays(1));
        }
        pedido.setBoletaNumero("BOL-" + System.currentTimeMillis());
        pedido.setSeguimiento("EN_PROCESO");

        boolean esCumple = usuario.getFechaNacimiento() != null &&
                usuario.getFechaNacimiento().getMonthValue() == LocalDate.now().getMonthValue() &&
                usuario.getFechaNacimiento().getDayOfMonth() == LocalDate.now().getDayOfMonth();

        if (usuario.isRegaloCumpleDuoc() && esCumple) {
            pedido.setRegalo("Pedido gratuito por cumpleaños DUOC");
            pedido.setTotal(0);
            pedido.setEstado("Entregado");
        } else if (beneficio != null && beneficio > 0) {
            int totalConDescuento = (int) Math.round(subtotal - (subtotal * (beneficio / 100.0)));
            pedido.setTotal(totalConDescuento);
            pedido.setEstado("Preparación");
        } else {
            pedido.setTotal(subtotal);
            pedido.setEstado("Preparación");
        }

        return pedidoRepo.save(pedido);
    }

    // =====================================================
    //  3) ADMIN ƒ?" ve todos los pedidos
    // =====================================================
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Pedido> listarTodos() {
        return pedidoRepo.findAll();
    }

    // =====================================================
    //  4) VENDEDOR ƒ?" tambiÇ¸n puede ver pedidos
    // =====================================================
    @GetMapping("/vendedor")
    @PreAuthorize("hasRole('VENDEDOR')")
    public List<Pedido> listarVendedor() {
        return pedidoRepo.findAll(); // vendedor ve todo igual que admin
    }

    // =====================================================
    //  5) Ver detalle de pedido (ADMIN o VENDEDOR)
    // =====================================================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    public Pedido obtenerPorId(@PathVariable Long id) {
        return pedidoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    @GetMapping("/mis-pedidos")
    @PreAuthorize("hasRole('CLIENTE')")
    public List<Pedido> listarPedidosCliente(@RequestParam Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return pedidoRepo.findByUsuario(usuario);
    }
    
}
