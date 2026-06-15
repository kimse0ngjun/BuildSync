package com.buildsync.controller.material;

import com.buildsync.dto.material.CompanyMaterialResponse;
import com.buildsync.dto.material.MaterialRequest;
import com.buildsync.service.material.CompanyMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company-materials")
@RequiredArgsConstructor
public class CompanyMaterialController {

    private final CompanyMaterialService companyMaterialService;

    // 내 회사 자재 목록 조회
    @GetMapping
    public List<CompanyMaterialResponse> getCompanyMaterials(
            Authentication authentication
    ) {
        String loginId = authentication.getName();
        return companyMaterialService.getCompanyMaterials(loginId);
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