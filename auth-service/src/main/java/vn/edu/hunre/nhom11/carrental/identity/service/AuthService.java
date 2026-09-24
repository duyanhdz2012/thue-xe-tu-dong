package vn.edu.hunre.nhom11.carrental.identity.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.hunre.nhom11.carrental.identity.domain.*;
import vn.edu.hunre.nhom11.carrental.identity.repository.UserRepository;
import vn.edu.hunre.nhom11.carrental.shared.exception.ApiException;

@Service
public class AuthService {
    private final UserRepository users; private final PasswordEncoder passwords; private final TokenService tokens;
    public AuthService(UserRepository u, PasswordEncoder p, TokenService t){users=u;passwords=p;tokens=t;}
    @Transactional public AuthResult register(String name,String email,String password,String phone){
        if(users.existsByEmailIgnoreCase(email)) throw new ApiException(HttpStatus.CONFLICT,"Email đã được sử dụng");
        User u=new User(); u.setName(name);u.setEmail(email.trim().toLowerCase());u.setPassword(passwords.encode(password));u.setPhone(phone);u=users.save(u);return result(u);
    }
    public AuthResult login(String email,String password){ User u=users.findByEmailIgnoreCase(email).orElseThrow(()->new ApiException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng")); if(u.isLocked()||!passwords.matches(password,u.getPassword())) throw new ApiException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng"); return result(u); }
    private AuthResult result(User u){return new AuthResult(tokens.issue(u),u.getId(),u.getName(),u.getEmail(),u.getRole());}
    public record AuthResult(String token,Long id,String name,String email,Role role){}
}

