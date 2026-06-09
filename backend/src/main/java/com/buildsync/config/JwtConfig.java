package com.buildsync.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import lombok.Getter;


@Component
@Getter
public class JwtConfig {

    @Value("${jwt.secret}")
    private String serverSecret;

    @Bean
    public String jwtSecret() {
        return serverSecret;
    }
}
