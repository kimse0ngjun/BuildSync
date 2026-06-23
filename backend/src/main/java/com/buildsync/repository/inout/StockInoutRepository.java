package com.buildsync.repository.inout;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.dto.inout.InOutSumResponse;
import com.buildsync.entity.StockInout;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface StockInoutRepository extends JpaRepository<StockInout, Long> {

	// 공급업체 전체 입출고 건수
	@Query("""
	    SELECT COUNT(DISTINCT s.id)
	    FROM StockInout s
	    JOIN SupMaterial sm
	        ON s.material.id = sm.material.id
	    WHERE sm.company.id = :companyId
	    AND sm.company.companyType = com.buildsync.entity.CompanyType.SUPPLIER
	""")
	long totalCountInout(@Param("companyId") Long companyId);


	// 공급업체 입고/출고 건수
	@Query("""
	    SELECT COUNT(DISTINCT s.id)
	    FROM StockInout s
	    JOIN SupMaterial sm
	        ON s.material.id = sm.material.id
	    WHERE sm.company.id = :companyId
	    AND s.type = :type
	    AND sm.company.companyType = com.buildsync.entity.CompanyType.SUPPLIER
	""")
	long countInout(
	        @Param("companyId") Long companyId,
	        @Param("type") String type);


	// 금일 처리 건수
	@Query("""
	    SELECT COUNT(DISTINCT s.id)
	    FROM StockInout s
	    JOIN SupMaterial sm
	        ON s.material.id = sm.material.id
	    WHERE sm.company.id = :companyId
	    AND s.processedDate = CURRENT_DATE
	    AND sm.company.companyType = com.buildsync.entity.CompanyType.SUPPLIER
	""")
	long countInoutToday(
	        @Param("companyId") Long companyId);


	// 입출고 목록
	@Query("""
		    SELECT DISTINCT s
		    FROM StockInout s
		    JOIN FETCH s.material m
		    LEFT JOIN FETCH s.site si
		    LEFT JOIN FETCH s.contact c
		    LEFT JOIN s.orders o
		    WHERE c.company.id = :companyId
		    AND (:type IS NULL OR :type = '' OR s.type = :type)
		    AND (:materialId IS NULL OR m.id = :materialId)
		    AND (:siteId IS NULL OR si.id = :siteId)
		    AND (:orderId IS NULL OR o.orderId = :orderId)
		    AND (:startDate IS NULL OR s.processedDate >= :startDate)
		    AND (:endDate IS NULL OR s.processedDate <= :endDate)
		    AND (
		        :keyword IS NULL
		        OR m.materialName LIKE CONCAT('%', :keyword, '%')
		        OR s.memo LIKE CONCAT('%', :keyword, '%')
		    )
		    ORDER BY s.processedDate DESC, s.id DESC
		""")
		List<StockInout> inoutListByFilters(
		        @Param("companyId") Long companyId,
		        @Param("type") String type,
		        @Param("materialId") Long materialId,
		        @Param("siteId") Long siteId,
		        @Param("orderId") Long orderId,
		        @Param("startDate") LocalDate startDate,
		        @Param("endDate") LocalDate endDate,
		        @Param("keyword") String keyword);


	// 입출고 총 수량
	@Query("""
	    SELECT COALESCE(SUM(s.quantity), 0)
	    FROM StockInout s
	    WHERE s.material.id IN (
	        SELECT sm.material.id
	        FROM SupMaterial sm
	        WHERE sm.company.id = :companyId
	        AND sm.company.companyType = com.buildsync.entity.CompanyType.SUPPLIER
	    )
	    AND (:type IS NULL OR :type = '' OR s.type = :type)
	    AND (:materialId IS NULL OR s.material.id = :materialId)
	    AND (:siteId IS NULL OR s.site.id = :siteId)
	    AND (:orderId IS NULL OR s.orders.orderId = :orderId)
	    AND (:startDate IS NULL OR s.processedDate >= :startDate)
	    AND (:endDate IS NULL OR s.processedDate <= :endDate)
	    AND (
	        :keyword IS NULL
	        OR s.material.materialName LIKE CONCAT('%', :keyword, '%')
	        OR s.memo LIKE CONCAT('%', :keyword, '%')
	    )
	""")
	long calculQtyByFilters(
	        @Param("companyId") Long companyId,
	        @Param("type") String type,
	        @Param("materialId") Long materialId,
	        @Param("siteId") Long siteId,
	        @Param("orderId") Long orderId,
	        @Param("startDate") LocalDate startDate,
	        @Param("endDate") LocalDate endDate,
	        @Param("keyword") String keyword);


	// 입고 상세
	@Query("""
	    SELECT si
	    FROM StockInout si
	    WHERE si.orders.orderId = :orderId
	""")
	List<StockInout> findByOrderId(
	        @Param("orderId") Long orderId);


	// 출고 상세
	@Query("""
	    SELECT si
	    FROM StockInout si
	    WHERE si.processedDate = :processedDate
	    AND si.site.id = :siteId
	    AND si.contact.contactId = :contactId
	    AND si.type = :type
	""")
	List<StockInout> findByProcessedDateAndSiteAndContactIdAndType(
	        @Param("processedDate") java.sql.Date processedDate,
	        @Param("siteId") Long siteId,
	        @Param("contactId") Long contactId,
	        @Param("type") String type);
	
	// 입출고 차트
	@Query("""
	        SELECT new com.buildsync.dto.inout.InOutSumResponse$ChartData(
	            CAST(s.processedDate AS string),
	            SUM(CASE WHEN s.type = '입고' THEN 1L ELSE 0L END),
	            SUM(CASE WHEN s.type = '출고' THEN 1L ELSE 0L END)
	        )
	        FROM StockInout s
	        JOIN s.contact c   
	        WHERE c.company.id = :companyId  
	        AND (:materialId IS NULL OR s.material.id = :materialId)
	        AND (:siteId IS NULL OR s.site.id = :siteId)
	        AND (:startDate IS NULL OR s.processedDate >= :startDate)
	        AND (:endDate IS NULL OR s.processedDate <= :endDate)
	        GROUP BY s.processedDate
	        ORDER BY s.processedDate ASC
	    """)
		List<InOutSumResponse.ChartData> getInoutChartData(
		        @Param("companyId") Long companyId,
		        @Param("materialId") Long materialId,
		        @Param("siteId") Long siteId,
		        @Param("startDate") LocalDate startDate,
		        @Param("endDate") LocalDate endDate);
	
	// 현장별 자재 사용 내역 조회 + 페이징
	@Query(
	        value = "SELECT s FROM StockInout s " +
	                "JOIN FETCH s.site si " +
	                "JOIN FETCH s.material m " +
	                "LEFT JOIN FETCH s.contact c " +
	                "WHERE si.company.loginId = :loginId " +
	                "AND s.type = '출고' " +
	                "AND (:siteId IS NULL OR si.id = :siteId) " +
	                "AND (:materialId IS NULL OR m.id = :materialId) " +
	                "AND (:keyword IS NULL OR :keyword = '' " +
	                "OR si.siteName LIKE CONCAT('%', :keyword, '%') " +
	                "OR m.materialName LIKE CONCAT('%', :keyword, '%') " +
	                "OR c.contactName LIKE CONCAT('%', :keyword, '%'))",
	        countQuery = "SELECT COUNT(s) FROM StockInout s " +
	                "JOIN s.site si " +
	                "JOIN s.material m " +
	                "LEFT JOIN s.contact c " +
	                "WHERE si.company.loginId = :loginId " +
	                "AND s.type = '출고' " +
	                "AND (:siteId IS NULL OR si.id = :siteId) " +
	                "AND (:materialId IS NULL OR m.id = :materialId) " +
	                "AND (:keyword IS NULL OR :keyword = '' " +
	                "OR si.siteName LIKE CONCAT('%', :keyword, '%') " +
	                "OR m.materialName LIKE CONCAT('%', :keyword, '%') " +
	                "OR c.contactName LIKE CONCAT('%', :keyword, '%'))"
	)
	Page<StockInout> findSiteMaterialUsages(
	        @Param("loginId") String loginId,
	        @Param("siteId") Long siteId,
	        @Param("materialId") Long materialId,
	        @Param("keyword") String keyword,
	        Pageable pageable
	);
}
