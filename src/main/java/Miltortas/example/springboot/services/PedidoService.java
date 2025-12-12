package Miltortas.example.springboot.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import Miltortas.example.springboot.models.*;
import Miltortas.example.springboot.repositories.PedidoRepository;
import Miltortas.example.springboot.repositories.UsuarioRepository;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepo;
    private final UsuarioRepository usuarioRepo;

    public Pedido crearPedido(Pedido pedido){

        Usuario usuario = usuarioRepo.findById(pedido.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        int subtotal = pedido.getTotal();
        int totalFinal = subtotal;

        // 🔥 Aplica el descuento permanente si existe
        if(usuario.getDescuento() > 0){
            int desc = (subtotal * usuario.getDescuento()) / 100;
            totalFinal -= desc;
        }

        // 🔥 Si es usuario DUOC y está en su cumpleaños → torta gratis
        if(usuario.isRegaloCumpleDuoc() &&
           usuario.getFechaNacimiento().getMonthValue()== LocalDate.now().getMonthValue() &&
           usuario.getFechaNacimiento().getDayOfMonth()== LocalDate.now().getDayOfMonth()){

            totalFinal = 0; // 🥳 Su pedido es gratis hoy
        }

        pedido.setTotal(totalFinal);
        return pedidoRepo.save(pedido);
    }
}
