package com.buildsync.repository.analysis;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buildsync.dto.analysis.MonthlyOrderCostResponse;
import com.buildsync.dto.analysis.SiteCostResponse;
import com.buildsync.entity.Orders;

public interface AnalysisRepository extends JpaRepository<Orders, Long> {

    // 월별 발주 비용
    @Query("""
        SELECT 
            FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') AS month,
            SUM(o.totalAmount) AS totalCost
        FROM Orders o
        WHERE o.company.id = :companyId
        GROUP BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m')
        ORDER BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m')
    """)
    List<MonthlyOrderCostResponse> findMonthlyCost(@Param("companyId") Long companyId);

    // 현장별 발주 비용 - 총액
    @Query("""
        SELECT 
            s.id AS siteId,
            s.siteName AS siteName,
            SUM(o.totalAmount) AS totalCost
        FROM Orders o
        JOIN o.site s
        WHERE o.company.id = :companyId
        GROUP BY s.id, s.siteName
    """)
    List<SiteCostResponse> findSiteCost(@Param("companyId") Long companyId);
}