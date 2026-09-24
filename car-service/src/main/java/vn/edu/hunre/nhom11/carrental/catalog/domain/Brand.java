package vn.edu.hunre.nhom11.carrental.catalog.domain;
import jakarta.persistence.*;
@Entity @Table(name="brands") public class Brand { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false,unique=true) private String name; public Long getId(){return id;} public void setId(Long v){id=v;} public String getName(){return name;} public void setName(String v){name=v;} }

