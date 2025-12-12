package Miltortas.example.springboot.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY = "CLAVE_SECRETA_MUY_LARGA_PARA_USAR_EN_JWT_1234567890";

    private Key getSigningKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generarToken(UserDetails user){
        return Jwts.builder()
                .setSubject(user.getUsername())  
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*24)) 
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String obtenerUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean esTokenValido(String token, UserDetails user){
        final String username = obtenerUsername(token);
        return username.equals(user.getUsername()) && !tokenExpirado(token);
    }

    private boolean tokenExpirado(String token){
        return obtenerExpiracion(token).before(new Date());
    }

    private Date obtenerExpiracion(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}
