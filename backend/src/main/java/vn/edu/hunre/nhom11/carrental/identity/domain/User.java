package vn.edu.hunre.nhom11.carrental.identity.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, length=100) private String name;
    @Column(nullable=false, unique=true, length=150) private String email;
    @JsonIgnore @Column(nullable=false) private String password;
    @Column(length=20) private String phone;
    @Column(length=255) private String address;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role = Role.CUSTOMER;
    @Column(nullable=false) private boolean locked = false;
    @Column(nullable=false, updatable=false) private Instant createdAt = Instant.now();
    public Long getId(){return id;} public void setId(Long v){id=v;} public String getName(){return name;} public void setName(String v){name=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getPassword(){return password;} public void setPassword(String v){password=v;}
    public String getPhone(){return phone;} public void setPhone(String v){phone=v;} public String getAddress(){return address;} public void setAddress(String v){address=v;}
    public Role getRole(){return role;} public void setRole(Role v){role=v;} public boolean isLocked(){return locked;} public void setLocked(boolean v){locked=v;}
    public Instant getCreatedAt(){return createdAt;}
}

