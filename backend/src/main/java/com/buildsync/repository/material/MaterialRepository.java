package com.buildsync.repository.material;

import com.buildsync.dto.inout.SelectResponse;
import com.buildsync.entity.Material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import java.time.LocalDateTime;

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
    
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("""
    	    SELECT new com.buildsync.dto.inout.SelectResponse(
    	        m.id,
    	        m.materialName
    	    )
    	    FROM Material m
    	    ORDER BY m.materialName
    	""")
    	List<SelectResponse> findAllForSelect();
}