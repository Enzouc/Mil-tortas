package Miltortas.example.springboot.dto;

public record CrearPedidoItemDTO(
        Long productoId,
        int cantidad,
        String mensaje
) {}
