package com.buildsync.service.material;

import com.buildsync.dto.material.MaterialCategoryRequest;
import com.buildsync.dto.material.MaterialCategoryResponse;
import com.buildsync.entity.MaterialCategory;
import com.buildsync.repository.material.MaterialCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialCategoryService {

    private final MaterialCategoryRepository materialCategoryRepository;

    // 카테고리 등록
    @Transactional
    public MaterialCategoryResponse createCategory(MaterialCategoryRequest request) {

        if (materialCategoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("이미 존재하는 카테고리입니다.");
        }

        MaterialCategory category = MaterialCategory.builder()
                .categoryName(request.getCategoryName())
                .createdAt(LocalDateTime.now())
                .build();

        return MaterialCategoryResponse.from(materialCategoryRepository.save(category));
    }

    // 카테고리 목록 조회
    public List<MaterialCategoryResponse> getCategories() {
        return materialCategoryRepository.findAll()
                .stream()
                .map(MaterialCategoryResponse::from)
                .toList();
    }

    // 카테고리 수정
    @Transactional
    public MaterialCategoryResponse updateCategory(Long categoryId, MaterialCategoryRequest request) {

        MaterialCategory category = materialCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("카테고리가 존재하지 않습니다."));

        category.setCategoryName(request.getCategoryName());

        return MaterialCategoryResponse.from(category);
    }

    // 카테고리 삭제
    @Transactional
    public void deleteCategory(Long categoryId) {

        MaterialCategory category = materialCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("카테고리가 존재하지 않습니다."));

        materialCategoryRepository.delete(category);
    }
}