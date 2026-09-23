# Car Rental Modular Monolith

Full-stack self-drive car rental project based on the supplied report. The backend is one deployable Spring Boot application split into business modules; the frontend is a Next.js application.

## Modules

- `identity`: registration, login, JWT, users and roles
- `catalog`: brands, car types and cars
- `booking`: rental orders, availability and status workflow
- `payment`: deposits and payment records
- `content`: news
- `dashboard`: admin statistics
- `shared`: security, errors and cross-module configuration

## Run locally

### Backend with the built-in development database

```powershell
cd backend
mvn clean package
java -jar target/car-rental-1.0.0.jar
```

API documentation: http://localhost:8080/swagger-ui.html

Seed accounts:

- Admin: `admin@carrental.vn` / `Admin@123`
- Customer: `customer@carrental.vn` / `Customer@123`

### Frontend

```powershell
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000.

### MySQL profile

```powershell
docker compose up -d mysql
cd backend
mvn clean package
java -jar target/car-rental-1.0.0.jar --spring.profiles.active=mysql
```

Environment variables can override `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and `NEXT_PUBLIC_API_URL`.
