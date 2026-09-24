package vn.edu.hunre.nhom11.carrental.catalog.service;
import org.springframework.data.domain.*; import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import vn.edu.hunre.nhom11.carrental.catalog.domain.*; import vn.edu.hunre.nhom11.carrental.catalog.repository.*; import vn.edu.hunre.nhom11.carrental.shared.exception.ApiException;
@Service public class CarService {
 private final CarRepository cars; private final BrandRepository brands; private final CarTypeRepository types; public CarService(CarRepository c,BrandRepository b,CarTypeRepository t){cars=c;brands=b;types=t;}
 public Page<Car> search(String q,Long brandId,Long typeId,CarStatus status,Pageable p){return cars.search(blank(q)?null:q,brandId,typeId,status,p);}
 public Car get(Long id){return cars.findById(id).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Không tìm thấy xe"));}
 public Car getForUpdate(Long id){return cars.findByIdForUpdate(id).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Không tìm thấy xe"));}
 @Transactional public Car save(Long id,CarCommand r){Car c=id==null?new Car():get(id);c.setName(r.name());c.setLicensePlate(r.licensePlate());c.setDailyPrice(r.dailyPrice());c.setDescription(r.description());c.setImageUrl(r.imageUrl());c.setLocation(r.location());c.setModelYear(r.modelYear());c.setStatus(r.status()==null?CarStatus.AVAILABLE:r.status());c.setBrand(brands.findById(r.brandId()).orElseThrow(()->new ApiException(HttpStatus.BAD_REQUEST,"Hãng xe không tồn tại")));c.setCarType(types.findById(r.carTypeId()).orElseThrow(()->new ApiException(HttpStatus.BAD_REQUEST,"Loại xe không tồn tại")));return cars.save(c);}
 public void delete(Long id){if(!cars.existsById(id))throw new ApiException(HttpStatus.NOT_FOUND,"Không tìm thấy xe");cars.deleteById(id);} private boolean blank(String s){return s==null||s.isBlank();}
 public record CarCommand(String name,String licensePlate,java.math.BigDecimal dailyPrice,String description,String imageUrl,String location,Integer modelYear,CarStatus status,Long brandId,Long carTypeId){}
}

