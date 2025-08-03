package com.khang.todoapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // allow all routes requested from the frontend
                .allowedOrigins("http://localhost:5173") // only accept request from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // allow these HTTP methods
                .allowedHeaders("*")
                // credentials = cookies, authorization headers, ... are allowed
                .allowCredentials(true);
    }
}
