package vn.edu.hunre.nhom11.carrental.shared.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.edu.hunre.nhom11.carrental.identity.domain.Role;
import vn.edu.hunre.nhom11.carrental.identity.domain.User;
import vn.edu.hunre.nhom11.carrental.identity.repository.UserRepository;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedUsers(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (users.count() > 0) return;
            users.save(user("Quản trị viên", "admin@carrental.vn", "Admin@123", Role.ADMIN, encoder));
            users.save(user("Khách hàng mẫu", "customer@carrental.vn", "Customer@123", Role.CUSTOMER, encoder));
        };
    }

    private User user(String name, String email, String password, Role role, PasswordEncoder encoder) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setRole(role);
        return user;
    }
}
