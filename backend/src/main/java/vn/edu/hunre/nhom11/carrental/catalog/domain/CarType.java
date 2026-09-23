package vn.edu.hunre.nhom11.carrental.catalog.domain;
import jakarta.persistence.*;
@Entity @Table(name="car_types") public class CarType { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false,unique=true) private String name; private Integer seats; public Long getId(){return id;} public void setId(Long v){id=v;} public String getName(){return name;} public void setName(String v){name=v;} public Integer getSeats(){return seats;} public void setSeats(Integer v){seats=v;} }

