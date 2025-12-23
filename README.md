# Cryptid API

REST API developed with TypeScript, Fastify, Drizzle ORM following DDD (Domain-Driven Design) and Clean Architecture principles.

## Technologies

- **Node.js** + **TypeScript**
- **Fastify** - Web framework
- **Drizzle ORM** - Type-safe ORM
- **Zod** - Schema validation
- **TSyringe** - Dependency injection
- **Postgres** - PostgreSQL driver (compatible with Supabase)
- **Swagger/OpenAPI** - API documentation

## Project Structure

```
src/
├── config/                   # Application configuration
│   └── env.ts                # Environment variables
│
├── shared/                   # Shared code
│   ├── core/                 # Core building blocks
│   │   ├── Either.ts         # Either type for error handling
│   │   └── UseCase.ts        # UseCase interface
│   ├── domain/               # Domain building blocks
│   │   ├── Entity.ts         # Entity base class
│   │   ├── ValueObject.ts    # ValueObject base class
│   │   └── AggregateRoot.ts  # AggregateRoot base class
│   └── errors/               # Custom errors
│       └── AppError.ts       # Error classes
│
├── modules/                  # Application modules (DDD)
│   └── cryptids/
│       ├── domain/           # Domain layer
│       │   ├── entities/     # Domain entities
│       │   └── repositories/ # Repository interfaces
│       ├── application/      # Application layer
│       │   └── use-cases/    # Use cases
│       └── infra/            # Infrastructure layer
│           ├── http/         # Controllers and HTTP routes
│           └── repositories/ # Repository implementations
│
├── infra/                    # Global infrastructure
│   ├── database/             # Database configuration
│   │   ├── schemas/          # Drizzle schemas
│   │   ├── migrations/       # Migrations
│   │   └── connection.ts     # DB connection
│   ├── http/                 # HTTP configuration
│   │   ├── plugins/          # Fastify plugins
│   │   ├── routes/           # Main routes
│   │   └── app.ts            # Application setup
│   └── container/            # DI container
│       └── index.ts          # Dependency registration
│
└── server.ts                 # Application entry point
```

## Applied Principles

### Domain-Driven Design (DDD)

- **Entities**: Objects with unique identity (ID)
- **Value Objects**: Immutable objects without identity
- **Aggregate Roots**: Entities that are aggregate roots
- **Repositories**: Abstraction for data persistence
- **Use Cases**: Application business logic

### Clean Architecture

- **Domain Layer**: Pure business rules (entities, value objects)
- **Application Layer**: Use cases
- **Infrastructure Layer**: Technical implementations (database, http, repositories)
- **Dependency Rule**: Dependencies always point inward (domain ← application ← infrastructure)

### Modularization

Each module (e.g., `cryptids`) is completely independent and contains:
- Its own domain entities
- Its own use cases
- Its own routes and controllers
- Its own repository implementations

## Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Database - Generate migrations
pnpm db:generate

# Database - Apply migrations
pnpm db:migrate

# Database - Push schema (without migrations)
pnpm db:push

# Database - Visual interface
pnpm db:studio
```

## Configuration

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Configure the environment variables in the `.env` file

3. Run the migrations:
```bash
pnpm db:push
```

4. Start the server:
```bash
pnpm dev
```

## Endpoints

The API will be available at `http://localhost:3000`

### Documentation
- Swagger UI: `http://localhost:3000/docs`

### Health Check
- `GET /health` - API status

### Cryptids
- `POST /api/v1/cryptids` - Create cryptid
- `GET /api/v1/cryptids` - List all
- `GET /api/v1/cryptids/:id` - Get by ID

## Code Patterns

- **Either Pattern**: For functional error handling
- **Dependency Injection**: TSyringe for inversion of control
- **Repository Pattern**: Data layer abstraction
- **DTO Pattern**: Data Transfer Objects for validation

## Adding New Modules

To add a new module following DDD:

1. Create the folder structure in `src/modules/new-module/`
2. Implement domain entities in `domain/entities/`
3. Create repository interfaces in `domain/repositories/`
4. Implement use cases in `application/use-cases/`
5. Implement repositories in `infra/repositories/`
6. Create controllers in `infra/http/controllers/`
7. Register routes in `infra/http/routes/`
8. Register dependencies in `src/infra/container/`

## License

ISC
