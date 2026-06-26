package com.buildsync.repository.analysis;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buildsync.dto.analysis.MonthlySalesProjection;
import com.buildsync.dto.analysis.SiteMaterialCostProjection;
import com.buildsync.entity.Orders;


public interface SupplierAnalysisRepository
extends JpaRepository<Orders, Long> {


    // 공급업체 월별 판매 비용
	@Query(value = """

			SELECT

			DATE_FORMAT(
			    si.processed_date,
			    '%Y-%m'
			) AS month,


			COALESCE(
			    SUM(
			        si.quantity * ss.unit_price
			    ),
			    0
			) AS totalSales


			FROM stock_inout si


			JOIN sites s
			ON si.site_id = s.site_id


			JOIN sup_stock ss
			ON si.material_id = ss.material_id


			WHERE ss.company_id = :companyId


			AND si.type IN ('OUT','출고')


			GROUP BY
			DATE_FORMAT(
			    si.processed_date,
			    '%Y-%m'
			)


			ORDER BY month


			""",
			nativeQuery = true)
			List<MonthlySalesProjection>
			findMonthlySales(
			    @Param("companyId") Long companyId
			);





    // 공급업체 현장별 자재 비용
    @Query(value = """

        SELECT


        s.site_name AS siteName,


        m.material_name AS materialName,


        SUM(si.quantity)
        AS quantity,


        MAX(ss.unit_price)
        AS unitPrice,


        SUM(
            si.quantity * ss.unit_price
        )
        AS totalPrice



        FROM stock_inout si



        JOIN sites s
        ON si.site_id = s.site_id



        JOIN material m
        ON si.material_id = m.material_id



        JOIN sup_stock ss
        ON si.material_id = ss.material_id



        WHERE ss.company_id = :companyId



        AND si.type IN ('OUT','출고')



        GROUP BY


        s.site_name,

        m.material_name



        ORDER BY


        s.site_name,

        m.material_name


        """,
        nativeQuery = true)
    List<SiteMaterialCostProjection>
    findSiteMaterialCost(
        @Param("companyId") Long companyId
    );

}