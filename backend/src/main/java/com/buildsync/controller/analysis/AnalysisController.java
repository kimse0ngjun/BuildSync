package com.buildsync.controller.analysis;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.analysis.MonthlyMaterialCostResponse;
import com.buildsync.dto.analysis.SiteMaterialUsageAnalysisResponse;
import com.buildsync.service.analysis.AnalysisService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    // 월별 자재 구매 비용 분석
    @GetMapping("/material/monthly")
    public ResponseEntity<List<MonthlyMaterialCostResponse>> monthlyMaterialCost(
            @RequestParam("companyId") Long companyId
    ){
        return ResponseEntity.ok(
            analysisService.getMonthlyMaterialCost(companyId)
        );
    }

    // 현장별 자재 사용 비용 분석
    @GetMapping("/material/site")
    public ResponseEntity<List<SiteMaterialUsageAnalysisResponse>> siteMaterialUsage(
            @RequestParam("companyId") Long companyId
    ){
        return ResponseEntity.ok(
            analysisService.getSiteMaterialUsage(companyId)
        );
    }

}
