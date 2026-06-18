package com.buildsync.controller.admin;

import com.buildsync.dto.admin.AdminDashboardResponse;
import com.buildsync.service.admin.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public AdminDashboardResponse getDashboard() {
        return adminDashboardService.getDashboard();
    }
}