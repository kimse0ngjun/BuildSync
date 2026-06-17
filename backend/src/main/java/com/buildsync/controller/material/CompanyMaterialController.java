package com.buildsync.controller.material;

import com.buildsync.dto.material.CompanyMaterialDashboardResponse;
import com.buildsync.dto.material.CompanyMaterialResponse;
import com.buildsync.dto.material.MaterialRequest;
import com.buildsync.service.material.CompanyMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company-materials")
@RequiredArgsConstructor
public class CompanyMaterialController {

    private final CompanyMaterialService companyMaterialService;

    // 내 회사 자재 목록 조회 + 통계 카드 + 검색/필터
    @GetMapping
    public CompanyMaterialDashboardResponse getCompanyMaterials(
            Authentication authentication,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status
    ) {
        String loginId = authentication.getName();
        return companyMaterialService.getCompanyMaterials(loginId, keyword, category, status);
    }

    // 내 회사 자재 수정
    @PutMapping("/{materialId}")
    public CompanyMaterialResponse updateCompanyMaterial(
            Authentication authentication,
            @PathVariable("materialId") Long materialId,
            @RequestBody MaterialRequest request
    ) {
        String loginId = authentication.getName();

        return companyMaterialService.updateCompanyMaterial(
                loginId,
                materialId,
                request
        );
    }

    // 내 회사 자재 삭제
    @DeleteMapping("/{materialId}")
    public String deleteCompanyMaterial(
            Authentication authentication,
            @PathVariable("materialId") Long materialId
    ) {
        String loginId = authentication.getName();
        companyMaterialService.deleteCompanyMaterial(loginId, materialId);

        return "내 회사 자재에서 삭제되었습니다.";
    }
}