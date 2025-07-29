package com.khang.todoapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // allow all routes requested from the frontend
                .allowedOrigins("http://localhost:3000") // only accept request from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE") // allow these HTTP methods
                // credentials = cookies, authorization headers, ... are allowed
                .allowCredentials(true); 
    }
}
