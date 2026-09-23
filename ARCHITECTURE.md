# Modular Monolith Architecture

The backend is packaged and deployed as one Spring Boot application. Business capabilities are isolated by top-level package rather than by technical layer across the whole system.

```text
vn.edu.hunre.nhom11.carrental
├── identity        authentication, users, roles and JWT
├── catalog         brands, vehicle types and the fleet
├── booking         rental availability and order lifecycle
├── payment         deposits and payment records
├── content         customer-facing news
├── dashboard       administrative projections
└── shared          security, configuration and error handling
```

Inside a module, dependencies follow `api -> service -> repository -> domain`. Controllers never access another module's repositories directly. Cross-module workflows call the target module's service, for example booking uses `CarService`, while payment uses `BookingService`.

The frontend is a separate Next.js client because that is the architecture described by the supplied report. It does not change the backend's modular-monolith deployment model.

## Main API groups

- `/api/auth`: register and login
- `/api/users`: admin user management
- `/api/cars`, `/api/brands`, `/api/car-types`: fleet catalog
- `/api/bookings`: customer bookings and admin workflow
- `/api/payments`: payment recording
- `/api/news`: public content and admin publishing
- `/api/dashboard`: admin metrics

## Production hardening

Use the MySQL profile, set a strong `JWT_SECRET`, restrict CORS to the deployed frontend, disable H2, and replace the demonstration payment recording with a signed payment-gateway integration.
