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
public interface AnalysisRepository extends JpaRepository<Orders, Long> {

    // 월별 자재 비용 분석
    @Query(value = """

        SELECT
            DATE_FORMAT(si.processed_date, '%Y-%m') AS month,

			COALESCE(
			    SUM(
			        CASE
			            WHEN si.type = '입고'
			            THEN si.quantity
			            ELSE 0
			        END
			    )
			    -
			    SUM(
			        CASE
			            WHEN si.type = '출고'
			            THEN si.quantity
			            ELSE 0
			        END
			    ),
			    0
			) AS totalQuantity,

			COALESCE(
			    SUM(
			        CASE
			            WHEN si.type = '입고'
			            THEN si.quantity * COALESCE(ss.unit_price,0)
			            ELSE 0
			        END
			    ),
			    0
			) AS totalMaterialCost

        FROM stock_inout si

        JOIN sites s
            ON si.site_id = s.site_id

        LEFT JOIN sup_stock ss
            ON ss.material_id = si.material_id
            AND ss.company_id = s.company_id

        WHERE s.company_id = :companyId

        GROUP BY
            DATE_FORMAT(si.processed_date, '%Y-%m')

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

            m.unit AS unit,

            COALESCE(
                SUM(
                    CASE
                        WHEN si.type IN ('IN','입고')
                        THEN si.quantity
                        ELSE 0
                    END
                ),
                0
            ) AS inboundQuantity,

            COALESCE(
                SUM(
                    CASE
                        WHEN si.type IN ('OUT','출고')
                        THEN si.quantity
                        ELSE 0
                    END
                ),
                0
            ) AS outboundQuantity,

            COALESCE(
                SUM(
                    CASE
                        WHEN si.type IN ('IN','입고')
                        THEN si.quantity
                        ELSE 0
                    END
                )
                -
                SUM(
                    CASE
                        WHEN si.type IN ('OUT','출고')
                        THEN si.quantity
                        ELSE 0
                    END
                ),
                0
            ) AS currentStock,

            COALESCE(
                MAX(oi.unit_price),
                MAX(ss.unit_price),
                0
            ) AS unitPrice

        FROM stock_inout si

        JOIN sites s
            ON si.site_id = s.site_id

        JOIN material m
            ON si.material_id = m.material_id

        LEFT JOIN order_items oi
            ON oi.material_id = m.material_id

        LEFT JOIN sup_stock ss
            ON ss.material_id = m.material_id

        WHERE s.company_id = :companyId

        GROUP BY
            s.site_id,
            s.site_name,
            m.material_id,
            m.material_name,
            m.unit

        ORDER BY
            s.site_name,
            m.material_name

        """, nativeQuery = true)
    List<SiteMaterialUsageAnalysisProjection>
    findSiteMaterialUsage(
        @Param("companyId") Long companyId
    );
}