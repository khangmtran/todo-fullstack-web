package com.khang.todoapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.khang.todoapp.model.User;
import com.khang.todoapp.repository.UserRepository;
import com.khang.todoapp.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import java.util.Collections;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    public ResponseEntity<?> signup(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }
        user.setPassword(bCrypt.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Sign up successfully");
    }

    public ResponseEntity<?> login(User loginRequest) {
        Optional<User> optUser = userRepository.findByUsername(loginRequest.getUsername());
        if(optUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username not found");
        }
        User user = optUser.get();
        if (!bCrypt.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
    
}
