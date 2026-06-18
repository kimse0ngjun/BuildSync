package com.buildsync.controller.material;

import com.buildsync.dto.material.MaterialCategoryRequest;
import com.buildsync.dto.material.MaterialCategoryResponse;
import com.buildsync.service.material.MaterialCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MaterialCategoryController {

    private final MaterialCategoryService materialCategoryService;

    // 카테고리 목록 조회
    @GetMapping("/api/material-categories")
    public List<MaterialCategoryResponse> getCategories() {
        return materialCategoryService.getCategories();
    }

    // 운영자 카테고리 등록
    @PostMapping("/api/admin/material-categories")
    public MaterialCategoryResponse createCategory(
            @RequestBody MaterialCategoryRequest request
    ) {
        return materialCategoryService.createCategory(request);
    }

    // 운영자 카테고리 수정
    @PutMapping("/api/admin/material-categories/{categoryId}")
    public MaterialCategoryResponse updateCategory(
            @PathVariable("categoryId") Long categoryId,
            @RequestBody MaterialCategoryRequest request
    ) {
        return materialCategoryService.updateCategory(categoryId, request);
    }

    // 운영자 카테고리 삭제
    @DeleteMapping("/api/admin/material-categories/{categoryId}")
    public String deleteCategory(
            @PathVariable("categoryId") Long categoryId
    ) {
        materialCategoryService.deleteCategory(categoryId);
        return "카테고리가 삭제되었습니다.";
    }
}