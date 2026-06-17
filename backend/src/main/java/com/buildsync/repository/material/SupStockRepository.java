package com.buildsync.repository.material;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Company;
import com.buildsync.entity.Material;
import com.buildsync.entity.SupStock;

@Repository
public interface SupStockRepository extends JpaRepository<SupStock, Long> {

    Optional<SupStock> findByCompanyAndMaterial(Company company, Material material);

    void deleteByMaterial(Material material);
    
    Optional<SupStock> findByCompanyIdAndMaterialId(Long companyId, Long materialId);
    
    // 최소 재고량 미만 전체 부족 재고 목록 조회
    @Query("SELECT s FROM SupStock s " +
    		"JOIN FETCH s.material m " +
    		"WHERE s.company.id = :companyId AND s.currentQuantity < s.minimumQuantity")
    List<SupStock> findShortageStocks(@Param("companyId") Long companyId);
    
    // 부족 재고 위험 (30% 이하)
    @Query("SELECT COUNT(s) FROM SupStock s " +
    		"WHERE s.company.id = :companyId AND s.currentQuantity <= (s.minimumQuantity * 0.3)")
    long countCriticalStocks(@Param("companyId") Long companyId);
    
    // 발주 들어간 부족 재고
    @Query("SELECT COUNT(DISTINCT oi.material.id) FROM OrderItems oi " +
    		"JOIN oi.orders o " +
    		"WHERE o.company.id = :companyId " +
    			"AND o.status IN (com.buildsync.entity.OrderStatus.PENDING, "
    			+ "com.buildsync.entity.OrderStatus.ACCEPTED)")
    long countOnOrderMaterials(@Param("companyId") Long companyId);

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