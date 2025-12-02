package Miltortas.example.springboot.dto;

import java.util.List;

public record CrearPedidoDTO(
        Long usuarioId,
        List<CrearPedidoItemDTO> items
) {}
