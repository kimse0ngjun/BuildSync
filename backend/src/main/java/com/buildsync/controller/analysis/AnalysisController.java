package com.buildsync.controller.analysis;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.analysis.MonthlyPurchaseProjection;
import com.buildsync.dto.analysis.MonthlySalesProjection;
import com.buildsync.dto.analysis.SiteMaterialCostProjection;
import com.buildsync.dto.analysis.SiteMaterialUsageProjection;
import com.buildsync.service.analysis.CompanyAnalysisService;
import com.buildsync.service.analysis.SupplierAnalysisService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {


    private final CompanyAnalysisService companyService;
    private final SupplierAnalysisService supplierService;



    // 건설업체 월별 구매 비용
    @GetMapping("/company/monthly-purchase")
    public ResponseEntity<List<MonthlyPurchaseProjection>> monthlyPurchase(
            @RequestParam("companyId") Long companyId
    ){

        return ResponseEntity.ok(
            companyService.getMonthlyPurchase(companyId)
        );
    }



    // 건설업체 현장별 사용 비용
    @GetMapping("/company/site-usage")
    public ResponseEntity<List<SiteMaterialUsageProjection>> siteUsage(
            @RequestParam("companyId") Long companyId
    ){

        return ResponseEntity.ok(
            companyService.getSiteUsage(companyId)
        );
    }




    // 공급업체 월별 판매
    @GetMapping("/supplier/monthly-sales")
    public ResponseEntity<List<MonthlySalesProjection>> monthlySales(
            @RequestParam("companyId") Long companyId
    ){

        return ResponseEntity.ok(
            supplierService.getMonthlySales(companyId)
        );
    }





    // 공급업체 현장별 비용
    @GetMapping("/supplier/site-cost")
    public ResponseEntity<List<SiteMaterialCostProjection>> siteCost(
            @RequestParam("companyId") Long companyId
    ){

        return ResponseEntity.ok(
            supplierService.getSiteMaterialCost(companyId)
        );
    }

}