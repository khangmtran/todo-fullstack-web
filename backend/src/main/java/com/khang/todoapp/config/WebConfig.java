package com.khang.todoapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
   @Override
public void addCorsMappings(CorsRegistry registry) {
    String raw = System.getenv().getOrDefault("CORS_ALLOWED_ORIGIN", "http://localhost:5173");
    for (String origin : raw.split(",")) {
        registry.addMapping("/**")
            .allowedOriginPatterns("http://localhost:5173",
                           "http://192.168.*.*:5173")
            .allowedOrigins(origin.trim())
            .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Authorization")
            .allowCredentials(true);
    }
}
}
