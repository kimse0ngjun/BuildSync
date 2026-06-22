package com.buildsync.controller.admin;

import com.buildsync.dto.admin.AdminLoginRequest;
import com.buildsync.dto.admin.AdminLoginResponse;
import com.buildsync.service.admin.AdminAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    // 운영자 로그인
    @PostMapping("/login")
    public AdminLoginResponse login(@RequestBody AdminLoginRequest request) {
        return adminAuthService.login(request);
    }
}