package vn.edu.hunre.nhom11.carrental.identity.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hunre.nhom11.carrental.identity.domain.User;
public interface UserRepository extends JpaRepository<User,Long> { Optional<User> findByEmailIgnoreCase(String email); boolean existsByEmailIgnoreCase(String email); }

