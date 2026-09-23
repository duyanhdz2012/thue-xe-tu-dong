package vn.edu.hunre.nhom11.carrental.catalog.domain;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.Instant;
@Entity @Table(name="cars") public class Car {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String name; @Column(nullable=false,unique=true,length=20) private String licensePlate;
 @Column(nullable=false,precision=12,scale=2) private BigDecimal dailyPrice; @Column(length=1000) private String description; private String imageUrl; private String location; private Integer modelYear;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private CarStatus status=CarStatus.AVAILABLE; @ManyToOne(optional=false) private Brand brand; @ManyToOne(optional=false) private CarType carType;
 @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 public Long getId(){return id;} public void setId(Long v){id=v;} public String getName(){return name;} public void setName(String v){name=v;} public String getLicensePlate(){return licensePlate;} public void setLicensePlate(String v){licensePlate=v;}
 public BigDecimal getDailyPrice(){return dailyPrice;} public void setDailyPrice(BigDecimal v){dailyPrice=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public String getImageUrl(){return imageUrl;} public void setImageUrl(String v){imageUrl=v;}
 public String getLocation(){return location;} public void setLocation(String v){location=v;} public Integer getModelYear(){return modelYear;} public void setModelYear(Integer v){modelYear=v;} public CarStatus getStatus(){return status;} public void setStatus(CarStatus v){status=v;}
 public Brand getBrand(){return brand;} public void setBrand(Brand v){brand=v;} public CarType getCarType(){return carType;} public void setCarType(CarType v){carType=v;} public Instant getCreatedAt(){return createdAt;}
}

