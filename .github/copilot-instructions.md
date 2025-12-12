# Mil-tortas Backend - AI Coding Agent Instructions

## Project Overview
**Mil-tortas** is a Spring Boot 3.2 REST API for a bakery/pastry ordering system. It handles user authentication, product catalogs, and promotional discount orders via JWT tokens. The system is frontend-agnostic (CORS configured for `http://localhost:5173`).

## Architecture Patterns

### Request-Response Flow
1. **Controllers** (`/controllers/*`) → Handle HTTP requests and CORS
2. **Services** (`/services/*`) → Business logic; inject repositories and JWT service
3. **Repositories** → JPA interfaces extending `CrudRepository`
4. **Models** → JPA entities with Lombok `@Data` annotations

**Example**: `AuthController.login()` → `AuthService.login()` → `UsuarioRepository.findByCorreo()`

### Data Model Relationships
- **Usuario** (User) → has many **Pedidos** (Orders) via `@ManyToOne`
- **Pedido** → has many **PedidoDetalle** (Order Items) via `@OneToMany(cascade=CascadeType.ALL)`
- **PedidoDetalle** → references **Producto** (Product) via `@ManyToOne`
- **Usuario** implements Spring's `UserDetails` interface (required for security)

### Authentication & Authorization
- **JWT tokens** generated on login/register; expires in 1 hour (configurable in `application.properties`)
- **Public endpoints**: `/api/v1/auth/login`, `/api/v1/auth/register`
- **Protected endpoints**: Require valid JWT token via `JwtAuthenticationFilter`
- **Token extraction** in services via `JwtService.extraerCorreo(token)` to identify the user

### Promotional Discount System
When a user registers with a promo code (e.g., "MIL15", "FIESTA20"), their discount percentage is stored in `Usuario.beneficio`. When they create an order:
1. `PedidoService.crearPedido()` retrieves the user's `beneficio`
2. Applies percentage discount to `pedido.total` if `beneficio > 0`
3. Saves discounted order to database

This is **active** upon order creation, not applied retroactively.

## Key Files & Patterns

| File | Purpose | Key Pattern |
|------|---------|-------------|
| `SecurityConfig.java` | Stateless JWT auth chain | Disables CSRF; permits auth endpoints; adds `JwtAuthenticationFilter` |
| `JwtService.java` | Token generation/validation | Uses JJWT library; key derived from `jwt.secret` property |
| `AuthService.java` | User login/registration | Uses `PasswordEncoder` (BCrypt); assigns promo discount if provided |
| `PedidoService.java` | Order creation with discounts | Extracts user via JWT token; applies benefit percentage |
| `CorsConfig.java` | Frontend integration | Allows localhost:5173 with credentials |
| DTOs in `/dto/*` | Input validation contracts | Use Java records for immutability |

## Build & Run Commands

```bash
# Build (Maven wrapper included)
./mvnw clean package

# Run locally (starts on http://localhost:8080)
./mvnw spring-boot:run

# Run tests
./mvnw test
```

**Database Setup**: Create MySQL database named `miltortas` at `localhost:3306`. Use root user with no password (as configured in `application.properties`). Hibernate auto-creates/updates tables on startup (`ddl-auto=update`).

## Development Conventions

### Naming & Structure
- Controllers use kebab-case routes: `/api/v1/auth`, `/api/pedidos`, `/api/usuarios`
- DTOs are immutable records: `CrearPedidoDTO`, `AuthResponse` (builder pattern for response objects)
- Services are singletons injected via constructor using `@RequiredArgsConstructor` (Lombok)
- Models use entity annotations: `@Entity`, `@Table`, `@Column` for database mapping

### Error Handling
- Throw `RuntimeException` with descriptive messages (e.g., "Usuario no encontrado")
- Spring automatically converts to 500 HTTP responses; no custom error handlers yet
- Example: `usuarioRepository.findByCorreo().orElseThrow(() -> new RuntimeException(...))`

### Code Style
- Lombok reduces boilerplate: `@Data`, `@RequiredArgsConstructor`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Comments use emoji markers for logical sections: `/* ===== 🟢 LOGIN ===== */`
- Column constraints documented via `@Column(unique=true)`, `@Column(length=1000)`

## Integration Points

### Frontend Expectations
- **Base URL**: `http://localhost:8080/api`
- **CORS**: Pre-flight requests allowed; credentials required in requests
- **JWT Usage**: Include token as `Authorization: Bearer <token>` header (filter extracts via `getAuthHeader()`)
- **Response format**: JSON with `token` + `usuario` object on auth endpoints

### External Dependencies
- **Spring Security + JJWT**: Token generation, validation
- **Spring Data JPA + Hibernate**: ORM for MySQL
- **MySQL Connector**: Database driver
- **Lombok**: Annotation processor for getters/setters
- **Springdoc OpenAPI**: Auto-generates Swagger docs (available at `/swagger-ui.html`)

## Modification Guidelines

When adding features:
- **New endpoints**: Create controller method → service method → repository query
- **Database schema changes**: Update model entity annotations; Hibernate auto-migrates on startup
- **Promo codes**: Add conditions in `AuthService.register()` and reference `Usuario.beneficio` in discount logic
- **JWT customization**: Modify `JwtService.generarToken()` to add claims (e.g., user role)
- **CORS updates**: Edit `CorsConfig.java` to allow new origins

---
**Last Updated**: December 2025 | **Java Version**: 17 | **Spring Boot**: 3.2.0
