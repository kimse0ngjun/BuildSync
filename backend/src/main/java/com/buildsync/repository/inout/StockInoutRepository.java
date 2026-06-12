package com.buildsync.repository.inout;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.StockInout;

@Repository
public interface StockInoutRepository extends JpaRepository<StockInout, Long> {

	// 특정 회사 전체 입출고 건수
	@Query("SELECT COUNT(s) FROM StockInout s WHERE s.material.company.id = :companyId")
	long totalCountInout(@Param("companyId") Long companyId);
	
	// 각 입고, 출고 건수
	@Query("SELECT COUNT(s) FROM StockInout s " +
			"WHERE s.material.company.id = :companyId AND s.type = :type")
	long countInout(@Param("companyId") Long companyId, @Param("type") String type);
	
	// 금일 처리 건수
	@Query("SELECT COUNT(s) FROM StockInout s " +
			"WHERE s.material.company.id = :companyId AND s.processedDate = CURRENT_DATE")
	long countInoutToday(@Param("companyId") Long companyId);
	
	
	// 입출고 목록 (필터 적용)
	@Query("SELECT s FROM StockInout s " +
			"JOIN FETCH s.material m " +
			"LEFT JOIN FETCH s.site si " +
			"WHERE m.company.id = :companyId " +
			"AND (:type IS NULL OR :type = '' OR s.type = :type)" +
			"AND (:materialId IS NULL OR m.id = :materialId) " +
			"AND (:siteId IS NULL OR si.id = :siteId) " +
			"AND (:orderId IS NULL OR s.orders.id = :orderId) " +
			"AND (:startDate IS NULL OR s.processedDate >= :startDate) " +
			"AND (:endDate IS NULL OR s.processedDate <= :endDate) " +
			"ORDER BY s.id DESC")
	List<StockInout> inoutListByFilters(
			@Param("companyId") Long companyId,
			@Param("type") String type,
			@Param("materialId") Long materialId,
			@Param("siteId") Long siteId,
			@Param("orderId") Long orderId,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);
	
	// 하단 입출고 요약
	@Query("SELECT COALESCE(SUM(s.quantity), 0) FROM StockInout s " +
			"WHERE s.material.company.id = :companyId " +
			"AND (:type IS NULL OR :type = '' OR s.type = :type) " +
			"AND (:materialId IS NULL OR s.material.id = :materialId) " +
			"AND (:siteId IS NULL OR s.site.id = :siteId) " +
			"AND (:orderId IS NULL OR s.orders.id = :orderId) " +
			"AND (:startDate IS NULL OR s.processedDate >= :startDate) " +
			"AND (:endDate IS NULL OR s.processedDate <= :endDate)")
	long calculQtyByFilters(@Param("companyId") Long companyId,
			@Param("type") String type,
			@Param("materialId") Long materialId,
			@Param("siteId") Long siteId,
			@Param("orderId") Long orderId,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);
}
