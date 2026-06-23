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
			    DATE_FORMAT(s.processed_date,'%Y-%m') month,
			
			    SUM(
			        CASE
			            WHEN s.type='IN'
			            THEN s.quantity
			            ELSE -s.quantity
			        END
			    ) totalOrderAmount,
			
			    SUM(
			        CASE
			            WHEN s.type='IN'
			            THEN s.quantity*m.price
			            ELSE 0
			        END
			    ) totalMaterialCost
			
			FROM stock_inout s
			
			JOIN material m
			ON s.material_id=m.material_id
			
			GROUP BY DATE_FORMAT(s.processed_date,'%Y-%m')

		    ORDER BY month

		""", nativeQuery = true)
		List<MonthlyMaterialCostProjection>
		findMonthlyMaterialCost(
		    @Param("companyId") Long companyId
		);

	// 현장별 자재 사용 비용 분석
	@Query(value = """

			SELECT

			    s.site_id AS siteId,

			    s.site_name AS siteName,

			    m.material_name AS materialName,

			    m.unit AS unit,


			    COALESCE(SUM(
			        CASE
			            WHEN si.type='IN'
			            THEN si.quantity
			            ELSE 0
			        END
			    ),0) AS inboundQuantity,


			    COALESCE(SUM(
			        CASE
			            WHEN si.type='OUT'
			            THEN si.quantity
			            ELSE 0
			        END
			    ),0) AS outboundQuantity,


			    COALESCE(
			        SUM(
			            CASE
			                WHEN si.type='IN'
			                THEN si.quantity
			                ELSE 0
			            END
			        )
			        -
			        SUM(
			            CASE
			                WHEN si.type='OUT'
			                THEN si.quantity
			                ELSE 0
			            END
			        )
			    ,0) AS currentStock,


			    m.price AS unitPrice


			FROM stock_inout si

			JOIN sites s
			ON si.site_id = s.site_id

			JOIN material m
			ON si.material_id = m.material_id


			WHERE s.company_id = :companyId


			GROUP BY
			    s.site_id,
			    s.site_name,
			    m.material_name,
			    m.unit,
			    m.price


			""", nativeQuery = true)
			List<SiteMaterialUsageAnalysisProjection>
			findSiteMaterialUsage(
			    @Param("companyId") Long companyId
			);

}