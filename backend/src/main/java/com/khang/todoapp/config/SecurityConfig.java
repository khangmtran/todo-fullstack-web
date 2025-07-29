package com.khang.todoapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf().disable()  // disable CSRF for testing with Postman or curl
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // allow all requests
            )
            .build();
    }
}
