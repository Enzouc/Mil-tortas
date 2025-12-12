package Miltortas.example.springboot.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Mil Tortas API",
                version = "v1",
                description = "API REST con versionado /api/v1 para productos, pedidos y usuarios."
        )
)
public class OpenApiConfig {
}
