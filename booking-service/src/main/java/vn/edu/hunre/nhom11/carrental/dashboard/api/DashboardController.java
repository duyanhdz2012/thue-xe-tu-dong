package vn.edu.hunre.nhom11.carrental.dashboard.api;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import vn.edu.hunre.nhom11.carrental.booking.domain.BookingStatus;
import vn.edu.hunre.nhom11.carrental.booking.repository.BookingRepository;
import vn.edu.hunre.nhom11.carrental.payment.repository.PaymentRepository;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {
    private final BookingRepository bookings;
    private final PaymentRepository payments;
    private final RestClient authClient;
    private final RestClient carClient;

    public DashboardController(BookingRepository bookings, PaymentRepository payments,
            RestClient.Builder builder,
            @Value("${app.services.auth-url}") String authUrl,
            @Value("${app.services.car-url}") String carUrl) {
        this.bookings = bookings;
        this.payments = payments;
        this.authClient = builder.clone().baseUrl(authUrl).build();
        this.carClient = builder.clone().baseUrl(carUrl).build();
    }

    @GetMapping
    Object stats(@RequestHeader("Authorization") String authorization) {
        return Map.of(
                "users", userCount(authorization),
                "cars", carCount(),
                "bookings", bookings.count(),
                "pendingBookings", bookings.countByStatus(BookingStatus.PENDING),
                "revenue", payments.totalRevenue());
    }

    private long userCount(String authorization) {
        JsonNode users = authClient.get().uri("/api/users").header("Authorization", authorization)
                .retrieve().body(JsonNode.class);
        return users != null && users.isArray() ? users.size() : 0;
    }

    private long carCount() {
        JsonNode page = carClient.get().uri("/api/cars?size=1").retrieve().body(JsonNode.class);
        return page == null ? 0 : page.path("totalElements").asLong();
    }
}
