package vn.edu.hunre.nhom11.carrental.booking.repository;
import java.time.LocalDate;import java.util.List;import org.springframework.data.jpa.repository.*;import org.springframework.data.repository.query.Param;import vn.edu.hunre.nhom11.carrental.booking.domain.*;
public interface BookingRepository extends JpaRepository<Booking,Long>{List<Booking>findByCustomerEmailOrderByCreatedAtDesc(String email);@Query("select count(b)>0 from Booking b where b.car.id=:carId and b.status not in ('CANCELLED','COMPLETED') and b.pickupDate<=:returnDate and b.returnDate>=:pickupDate")boolean overlaps(@Param("carId")Long carId,@Param("pickupDate")LocalDate pickup,@Param("returnDate")LocalDate returned);long countByStatus(BookingStatus status);}

