package com.buildsync.controller.admin;

import com.buildsync.dto.admin.AdminCompanyResponse;
import com.buildsync.service.admin.AdminCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/companies")
@RequiredArgsConstructor
public class AdminCompanyController {

    private final AdminCompanyService adminCompanyService;

    //승인 대기 업체 목록 조회
    @GetMapping("/pending")
    public List<AdminCompanyResponse> getPendingCompanies() {
        return adminCompanyService.getPendingCompanies();
    }

    //업체 승인
    @PatchMapping("/{companyId}/approve")
    public AdminCompanyResponse approveCompany(
            @PathVariable("companyId") Long companyId
    ) {
        return adminCompanyService.approveCompany(companyId);
    }

    //업체 반려
    @PatchMapping("/{companyId}/reject")
    public AdminCompanyResponse rejectCompany(
            @PathVariable("companyId") Long companyId
    ) {
        return adminCompanyService.rejectCompany(companyId);
    }
}