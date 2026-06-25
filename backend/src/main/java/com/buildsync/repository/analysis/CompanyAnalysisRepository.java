package com.buildsync.repository.analysis;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buildsync.dto.analysis.MonthlyPurchaseProjection;
import com.buildsync.dto.analysis.SiteMaterialUsageProjection;
import com.buildsync.entity.Orders;


public interface CompanyAnalysisRepository 
extends JpaRepository<Orders, Long> {



    // 건설업체 월별 자재 구매 비용
    @Query(value = """

        SELECT

        DATE_FORMAT(
            o.order_date,
            '%Y-%m'
        ) AS month,


        COALESCE(
            SUM(o.total_amount),
            0
        ) AS totalCost


        FROM orders o


        WHERE o.company_id = :companyId


        GROUP BY
        DATE_FORMAT(
            o.order_date,
            '%Y-%m'
        )


        ORDER BY month


        """,
        nativeQuery = true)
    List<MonthlyPurchaseProjection>
    findMonthlyPurchase(
        @Param("companyId") Long companyId
    );

    // 현장별 자재 사용 합계
    @Query(value = """

        SELECT

        s.site_name AS siteName,


        COALESCE(
            SUM(
                si.quantity * ss.unit_price
            ),
            0
        ) AS totalQuantity


        FROM stock_inout si


        JOIN sites s
        ON si.site_id = s.site_id


        JOIN sup_stock ss
        ON si.material_id = ss.material_id


        WHERE s.company_id = :companyId


        AND si.type IN ('OUT','출고')


        GROUP BY
        s.site_name


        ORDER BY
        s.site_name


        """,
        nativeQuery = true)
    List<SiteMaterialUsageProjection>
    findSiteUsage(
        @Param("companyId") Long companyId
    );

}