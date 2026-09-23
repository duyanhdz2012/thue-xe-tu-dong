package vn.edu.hunre.nhom11.carrental.identity.api;
import org.springframework.http.HttpStatus; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*;
import vn.edu.hunre.nhom11.carrental.identity.repository.UserRepository; import vn.edu.hunre.nhom11.carrental.shared.exception.ApiException;
@RestController @RequestMapping("/api/users") @PreAuthorize("hasRole('ADMIN')")
public class UserController { private final UserRepository users; public UserController(UserRepository u){users=u;} @GetMapping public Object all(){return users.findAll();} @PatchMapping("/{id}/lock") public Object lock(@PathVariable Long id){var u=users.findById(id).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Không tìm thấy người dùng"));u.setLocked(!u.isLocked());return users.save(u);} }

