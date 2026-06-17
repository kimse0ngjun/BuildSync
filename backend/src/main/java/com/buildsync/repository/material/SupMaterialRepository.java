package com.buildsync.repository.material;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buildsync.entity.Company;
import com.buildsync.entity.Material;
import com.buildsync.entity.SupMaterial;

public interface SupMaterialRepository extends JpaRepository<SupMaterial, Long> {

    List<SupMaterial> findByCompany(Company company);

    Optional<SupMaterial> findByCompanyAndMaterial(Company company, Material material);

    boolean existsByCompanyAndMaterial(Company company, Material material);

    @EntityGraph(attributePaths = {"material"})
    List<SupMaterial> findByCompany_Id(@Param("companyId") Long companyId);

    // 내 회사 자재 검색 + 분류 필터
    @Query("SELECT sm FROM SupMaterial sm " +
            "JOIN FETCH sm.material m " +
            "JOIN FETCH sm.company c " +
            "WHERE c.id = :companyId " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "OR m.materialCode LIKE CONCAT('%', :keyword, '%') " +
            "OR m.materialName LIKE CONCAT('%', :keyword, '%') " +
            "OR m.materialCategory LIKE CONCAT('%', :keyword, '%') " +
            "OR m.specification LIKE CONCAT('%', :keyword, '%') " +
            "OR c.companyName LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:category IS NULL OR :category = '' OR m.materialCategory = :category)")
    List<SupMaterial> searchCompanyMaterials(
            @Param("companyId") Long companyId,
            @Param("keyword") String keyword,
            @Param("category") String category
    );
}