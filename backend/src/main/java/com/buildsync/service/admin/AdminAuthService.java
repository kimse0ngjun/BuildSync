package com.buildsync.service.admin;

import com.buildsync.config.JwtUtil;
import com.buildsync.dto.admin.AdminLoginRequest;
import com.buildsync.dto.admin.AdminLoginResponse;
import com.buildsync.entity.Admin;
import com.buildsync.repository.admin.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AdminLoginResponse login(AdminLoginRequest request) {

        Admin admin = adminRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new RuntimeException("운영자 계정이 존재하지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtUtil.generateToken(admin.getLoginId(), "ADMIN");

        return new AdminLoginResponse(
                token,
                admin.getAdminName(),
                admin.getRole()
        );
    }
}