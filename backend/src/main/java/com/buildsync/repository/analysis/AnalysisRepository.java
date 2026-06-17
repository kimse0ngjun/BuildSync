package com.buildsync.repository.analysis;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.dto.analysis.MonthlyMaterialCostProjection;
import com.buildsync.dto.analysis.SiteMaterialUsageAnalysisProjection;
import com.buildsync.entity.Orders;

@Repository
public interface AnalysisRepository extends JpaRepository<Orders, Long>{


    // 월별 자재 구매 비용
	@Query(value = """
		    SELECT
		        DATE_FORMAT(o.order_date, '%Y-%m') AS month,


		        COALESCE(SUM(
		            CASE
		                WHEN s.type = 'IN'
		                THEN s.quantity
		                ELSE 0
		            END
		        ),0) AS inboundQuantity,


		        COALESCE(SUM(o.total_amount),0)
		        AS totalOrderAmount,


		        COALESCE(SUM(
		            CASE
		                WHEN s.type = 'IN'
		                THEN s.quantity * m.price
		                ELSE 0
		            END
		        ),0)
		        AS totalMaterialCost


		    FROM orders o


		    LEFT JOIN stock_inout s
		        ON s.order_id = o.order_id


		    LEFT JOIN material m
		        ON s.material_id = m.material_id


		    LEFT JOIN order_items oi
		        ON oi.order_id = o.order_id


		    WHERE o.company_id = :companyId


		    GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')


		    ORDER BY month

		""", nativeQuery = true)
		List<MonthlyMaterialCostProjection>
		findMonthlyMaterialCost(
		    @Param("companyId") Long companyId
		);


    // 현장별 자재 사용 비용
    @Query(value = """

        SELECT

            s.site_id AS siteId,

            s.site_name AS siteName,

            m.material_name AS materialName,


            COALESCE(SUM(
                CASE
                    WHEN si.type = 'IN'
                    THEN si.quantity
                    ELSE 0
                END
            ),0) AS inboundQuantity,


            COALESCE(SUM(
                CASE
                    WHEN si.type = 'OUT'
                    THEN si.quantity
                    ELSE 0
                END
            ),0) AS outboundQuantity,


            COALESCE(
                SUM(
                    CASE
                        WHEN si.type = 'IN'
                        THEN si.quantity
                        ELSE 0
                    END
                )
                -
                SUM(
                    CASE
                        WHEN si.type = 'OUT'
                        THEN si.quantity
                        ELSE 0
                    END
                )
            ,0) AS currentStock,


            oi.unit_price AS unitPrice


        FROM stock_inout si


        JOIN sites s
            ON si.site_id = s.site_id


        JOIN material m
            ON si.material_id = m.material_id


        LEFT JOIN order_items oi
            ON si.material_id = oi.material_id


        WHERE s.company_id = :companyId


        GROUP BY
            s.site_id,
            s.site_name,
            m.material_name,
            oi.unit_price


    """, nativeQuery = true)
    List<SiteMaterialUsageAnalysisProjection>
    findSiteMaterialUsage(
        @Param("companyId") Long companyId
    );

}