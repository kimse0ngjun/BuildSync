package com.buildsync.controller.material;

import com.buildsync.dto.material.MaterialRequest;
import com.buildsync.dto.material.MaterialResponse;
import com.buildsync.service.material.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 전체 자재 목록 조회
    @GetMapping
    public List<MaterialResponse> getMaterials() {
        return materialService.getMaterials();
    }

    // 자재 상세 조회
    @GetMapping("/{materialId}")
    public MaterialResponse getMaterial(
            @PathVariable("materialId") Long materialId
    ) {
        return materialService.getMaterial(materialId);
    }
}