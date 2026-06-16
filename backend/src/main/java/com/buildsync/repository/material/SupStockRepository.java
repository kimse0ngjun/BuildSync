package com.buildsync.repository.material;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buildsync.entity.Company;
import com.buildsync.entity.Material;
import com.buildsync.entity.SupStock;

@Repository
public interface SupStockRepository extends JpaRepository<SupStock, Long> {

    Optional<SupStock> findByCompanyAndMaterial(Company company, Material material);

    void deleteByMaterial(Material material);
    
    Optional<SupStock> findByCompanyIdAndMaterialId(Long companyId, Long materialId);
    
 // 전체 자재 검색 + 분류 필터
    @Query("SELECT ss FROM SupStock ss " +
            "JOIN FETCH ss.material m " +
            "JOIN FETCH ss.company c " +
            "WHERE (:keyword IS NULL OR :keyword = '' " +
            "OR m.materialCode LIKE CONCAT('%', :keyword, '%') " +
            "OR m.materialName LIKE CONCAT('%', :keyword, '%') " +
            "OR m.materialCategory LIKE CONCAT('%', :keyword, '%') " +
            "OR m.specification LIKE CONCAT('%', :keyword, '%') " +
            "OR c.companyName LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:category IS NULL OR :category = '' OR m.materialCategory = :category)")
    List<SupStock> searchStocks(
            @Param("keyword") String keyword,
            @Param("category") String category
    );
}