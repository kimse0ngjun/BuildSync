package com.buildsync.dto.material;

import com.buildsync.entity.MaterialCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MaterialCategoryResponse {

    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;

    public static MaterialCategoryResponse from(MaterialCategory category) {
        return MaterialCategoryResponse.builder()
                .categoryId(category.getId())
                .categoryName(category.getCategoryName())
                .createdAt(category.getCreatedAt())
                .build();
    }
}