package vn.edu.hunre.nhom11.carrental.identity.api;

import jakarta.validation.Valid; import jakarta.validation.constraints.*;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import vn.edu.hunre.nhom11.carrental.identity.service.AuthService;

@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthService auth; public AuthController(AuthService a){auth=a;}
 @PostMapping("/register") ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r){return ResponseEntity.status(201).body(auth.register(r.name(),r.email(),r.password(),r.phone()));}
 @PostMapping("/login") Object login(@Valid @RequestBody LoginRequest r){return auth.login(r.email(),r.password());}
 public record RegisterRequest(@NotBlank String name,@Email @NotBlank String email,@Size(min=8) String password,String phone){}
 public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
}

