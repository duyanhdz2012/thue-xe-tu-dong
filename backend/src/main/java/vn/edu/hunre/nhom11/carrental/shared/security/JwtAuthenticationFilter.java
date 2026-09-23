package vn.edu.hunre.nhom11.carrental.shared.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import java.io.IOException; import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
import vn.edu.hunre.nhom11.carrental.identity.repository.UserRepository; import vn.edu.hunre.nhom11.carrental.identity.service.TokenService;
@Component public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final TokenService tokens; private final UserRepository users; public JwtAuthenticationFilter(TokenService t,UserRepository u){tokens=t;users=u;}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{String h=req.getHeader("Authorization");if(h!=null&&h.startsWith("Bearer "))try{var u=users.findByEmailIgnoreCase(tokens.subject(h.substring(7))).orElse(null);if(u!=null&&!u.isLocked())SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(u.getEmail(),null,List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole().name()))));}catch(Exception ignored){}chain.doFilter(req,res);}
}

