package vn.edu.hunre.nhom11.carrental.catalog.repository;
import jakarta.persistence.LockModeType; import java.util.Optional; import org.springframework.data.domain.*; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import vn.edu.hunre.nhom11.carrental.catalog.domain.*;
public interface CarRepository extends JpaRepository<Car,Long>{
 @Query("select c from Car c where (:q is null or lower(c.name) like lower(concat('%',:q,'%'))) and (:brandId is null or c.brand.id=:brandId) and (:typeId is null or c.carType.id=:typeId) and (:status is null or c.status=:status)")
 Page<Car> search(@Param("q")String q,@Param("brandId")Long brandId,@Param("typeId")Long typeId,@Param("status")CarStatus status,Pageable pageable);
 @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select c from Car c where c.id=:id") Optional<Car> findByIdForUpdate(@Param("id")Long id);
}
