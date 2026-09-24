package vn.edu.hunre.nhom11.carrental.booking.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import vn.edu.hunre.nhom11.carrental.booking.domain.Booking;
import vn.edu.hunre.nhom11.carrental.booking.domain.BookingStatus;
import vn.edu.hunre.nhom11.carrental.booking.repository.BookingRepository;
import vn.edu.hunre.nhom11.carrental.shared.exception.ApiException;

@Service
public class BookingService {
    private final BookingRepository bookings;
    private final RestClient carClient;
    private final RestClient authClient;

    public BookingService(BookingRepository bookings, RestClient.Builder restClient,
                          @Value("${app.services.car-url}") String carUrl,
                          @Value("${app.services.auth-url}") String authUrl) {
        this.bookings = bookings;
        this.carClient = restClient.baseUrl(carUrl).build();
        this.authClient = restClient.baseUrl(authUrl).build();
    }

    @Transactional
    public Booking create(String email, String authorization, BookingCommand request) {
        if (request.carId() == null || request.pickupDate() == null || request.returnDate() == null
                || request.returnDate().isBefore(request.pickupDate())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Thời gian thuê không hợp lệ");
        }
        CarSnapshot car = loadCar(request.carId());
        CustomerSnapshot customer = loadCustomer(authorization);
        if (bookings.overlaps(request.carId(), request.pickupDate(), request.returnDate())) {
            throw new ApiException(HttpStatus.CONFLICT, "Xe đã được đặt trong khoảng thời gian này");
        }
        long days = Math.max(1, ChronoUnit.DAYS.between(request.pickupDate(), request.returnDate()));
        Booking booking = new Booking();
        booking.setCustomerEmail(email);
        booking.setCustomerName(customer.name());
        booking.setCustomerPhone(customer.phone());
        booking.setCarId(car.id());
        booking.setCarName(car.name());
        booking.setCarDailyPrice(car.dailyPrice());
        booking.setPickupDate(request.pickupDate());
        booking.setReturnDate(request.returnDate());
        booking.setPickupLocation(request.pickupLocation());
        booking.setReturnLocation(request.returnLocation());
        booking.setNotes(request.notes());
        booking.setTotalAmount(car.dailyPrice().multiply(BigDecimal.valueOf(days)));
        return bookings.save(booking);
    }

    @Transactional(readOnly = true)
    public Object busyDates(Long carId) {
        loadCar(carId);
        return bookings.findBusyByCarId(carId).stream()
                .map(b -> new BusyRange(b.getPickupDate(), b.getReturnDate())).toList();
    }

    public Object mine(String email){return bookings.findByCustomerEmailOrderByCreatedAtDesc(email);}
    public Object all(){return bookings.findAll();}
    public Booking get(Long id){return bookings.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"Không tìm thấy đơn đặt xe"));}

    @Transactional
    public Booking status(Long id, BookingStatus next){Booking b=get(id);if(b.getStatus()==BookingStatus.COMPLETED||b.getStatus()==BookingStatus.CANCELLED)throw new ApiException(HttpStatus.CONFLICT,"Đơn đã kết thúc, không thể cập nhật");b.setStatus(next);return b;}

    @Transactional
    public Booking cancel(Long id,String email,boolean admin){Booking b=get(id);if(!admin&&!b.getCustomerEmail().equalsIgnoreCase(email))throw new ApiException(HttpStatus.FORBIDDEN,"Bạn không thể hủy đơn này");if(b.getStatus()!=BookingStatus.PENDING&&b.getStatus()!=BookingStatus.APPROVED)throw new ApiException(HttpStatus.CONFLICT,"Trạng thái hiện tại không cho phép hủy");b.setStatus(BookingStatus.CANCELLED);return b;}

    private CarSnapshot loadCar(Long id) {
        try {
            CarSnapshot car = carClient.get().uri("/api/cars/{id}", id).retrieve().body(CarSnapshot.class);
            if (car == null || car.dailyPrice() == null) throw new ApiException(HttpStatus.BAD_GATEWAY, "Car Service trả dữ liệu không hợp lệ");
            return car;
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().value() == 404) throw new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy xe");
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Không thể lấy dữ liệu xe từ Car Service");
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Không thể kết nối Car Service");
        }
    }

    private CustomerSnapshot loadCustomer(String authorization) {
        try {
            CustomerSnapshot customer = authClient.get().uri("/api/users/me")
                    .header("Authorization", authorization).retrieve().body(CustomerSnapshot.class);
            if (customer == null) throw new ApiException(HttpStatus.BAD_GATEWAY, "Auth Service trả dữ liệu không hợp lệ");
            return customer;
        } catch (RestClientResponseException e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Không thể lấy hồ sơ từ Auth Service");
        }
    }

    public record BookingCommand(Long carId, LocalDate pickupDate, LocalDate returnDate, String pickupLocation, String returnLocation, String notes) {}
    public record BusyRange(LocalDate pickupDate, LocalDate returnDate) {}
    public record CarSnapshot(Long id, String name, BigDecimal dailyPrice) {}
    public record CustomerSnapshot(Long id, String name, String email, String phone, String address, String role) {}
}
