package com.buildsync.repository.material;

import com.buildsync.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    Optional<Material> findByMaterialCode(String materialCode);

    boolean existsByMaterialCode(String materialCode);

    // 전체 자재 검색
    @Query("SELECT m FROM Material m " +
            "WHERE (:keyword IS NULL OR :keyword = '' " +
            "OR m.materialCode LIKE CONCAT('%', :keyword, '%') " +
            "OR m.materialName LIKE CONCAT('%', :keyword, '%') " +
            "OR m.materialCategory LIKE CONCAT('%', :keyword, '%') " +
            "OR m.specification LIKE CONCAT('%', :keyword, '%'))")
    List<Material> searchMaterials(@Param("keyword") String keyword);
}