package vn.edu.hunre.nhom11.carrental.identity.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.edu.hunre.nhom11.carrental.identity.domain.User;

@Service
public class TokenService {
    private final SecretKey key; private final long expirationMinutes;
    public TokenService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-minutes}") long minutes){key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); expirationMinutes=minutes;}
    public String issue(User user){ Instant now=Instant.now(); return Jwts.builder().subject(user.getEmail()).claim("role",user.getRole().name()).issuedAt(Date.from(now)).expiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES))).signWith(key).compact(); }
    public String subject(String token){ return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject(); }
}
