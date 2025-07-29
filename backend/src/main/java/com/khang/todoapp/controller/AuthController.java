package com.khang.todoapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.khang.todoapp.model.User;
import com.khang.todoapp.repository.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }
        user.setPassword(bCrypt.encode(user.getPassword()));
        userRepository.save(user);
        return "Sign up successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser.isEmpty()) {
            return "Username not found";
        }

        String existingUserPass = foundUser.get().getPassword();
        if (bCrypt.matches(user.getPassword(), existingUserPass)) {
            return "Login successful";
        } else {
            return "Invalid username or password";
        }
    }
    
}
