package com.buildsync.repository.material;

import com.buildsync.entity.MaterialCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialCategoryRepository extends JpaRepository<MaterialCategory, Long> {

    boolean existsByCategoryName(String categoryName);
}