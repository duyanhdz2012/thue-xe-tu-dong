package vn.edu.hunre.nhom11.carrental.booking.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "rental_bookings")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String customerEmail;
    @Column(nullable = false) private String customerName;
    private String customerPhone;
    @Column(nullable = false) private Long carId;
    @Column(nullable = false) private String carName;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal carDailyPrice;
    @Column(nullable = false) private LocalDate pickupDate;
    @Column(nullable = false) private LocalDate returnDate;
    private String pickupLocation;
    private String returnLocation;
    @Column(length = 500) private String notes;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal totalAmount;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal paidAmount = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING) private BookingStatus status = BookingStatus.PENDING;
    private Instant createdAt = Instant.now();

    public Long getId(){return id;}
    public CustomerSnapshot getCustomer(){return new CustomerSnapshot(customerName, customerEmail, customerPhone);}
    public CarSnapshot getCar(){return new CarSnapshot(carId, carName, carDailyPrice);}
    public String getCustomerEmail(){return customerEmail;} public void setCustomerEmail(String v){customerEmail=v;}
    public String getCustomerName(){return customerName;} public void setCustomerName(String v){customerName=v;}
    public String getCustomerPhone(){return customerPhone;} public void setCustomerPhone(String v){customerPhone=v;}
    public Long getCarId(){return carId;} public void setCarId(Long v){carId=v;}
    public String getCarName(){return carName;} public void setCarName(String v){carName=v;}
    public BigDecimal getCarDailyPrice(){return carDailyPrice;} public void setCarDailyPrice(BigDecimal v){carDailyPrice=v;}
    public LocalDate getPickupDate(){return pickupDate;} public void setPickupDate(LocalDate v){pickupDate=v;}
    public LocalDate getReturnDate(){return returnDate;} public void setReturnDate(LocalDate v){returnDate=v;}
    public String getPickupLocation(){return pickupLocation;} public void setPickupLocation(String v){pickupLocation=v;}
    public String getReturnLocation(){return returnLocation;} public void setReturnLocation(String v){returnLocation=v;}
    public String getNotes(){return notes;} public void setNotes(String v){notes=v;}
    public BigDecimal getTotalAmount(){return totalAmount;} public void setTotalAmount(BigDecimal v){totalAmount=v;}
    public BigDecimal getPaidAmount(){return paidAmount;} public void setPaidAmount(BigDecimal v){paidAmount=v;}
    public BookingStatus getStatus(){return status;} public void setStatus(BookingStatus v){status=v;}
    public Instant getCreatedAt(){return createdAt;}

    public record CustomerSnapshot(String name, String email, String phone) {
        public String getEmail() { return email; }
    }
    public record CarSnapshot(Long id, String name, BigDecimal dailyPrice) {}
}
