package com.buildsync.controller.material;

import com.buildsync.dto.material.MaterialDashboardResponse;
import com.buildsync.dto.material.MaterialRequest;
import com.buildsync.dto.material.MaterialResponse;
import com.buildsync.service.material.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    // 자재 등록 + 내 회사 자재로 자동 등록
    @PostMapping
    public MaterialResponse createMaterial(
            Authentication authentication,
            @RequestBody MaterialRequest request
    ) {
        String loginId = authentication.getName();
        return materialService.createMaterial(loginId, request);
    }

    // 전체 자재 목록 조회 + 통계 카드 + 검색/필터 + 페이징
    @GetMapping
    public MaterialDashboardResponse getMaterials(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return materialService.getMaterials(keyword, category, status, pageable);
    }

    // 자재 상세 조회
    @GetMapping("/{materialId}")
    public MaterialResponse getMaterial(
            @PathVariable("materialId") Long materialId
    ) {
        return materialService.getMaterial(materialId);
    }
}