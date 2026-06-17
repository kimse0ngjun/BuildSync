package com.buildsync.controller.analysis;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.analysis.MonthlyOrderCostResponse;
import com.buildsync.dto.analysis.SiteCostResponse;
import com.buildsync.service.analysis.AnalysisService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

	private final AnalysisService analysisService; 

    // 월별 발주 비용 분석
    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyOrderCostResponse>> getMonthlyCost(
            @RequestParam("companyId") Long companyId
    ) {
        return ResponseEntity.ok(
                analysisService.getMonthlyCost(companyId)
        );
    }

    // 현장별 발주 비용 분석
    @GetMapping("/site")
    public ResponseEntity<List<SiteCostResponse>> getSiteCost(
            @RequestParam("companyId") Long companyId
    ) {
        return ResponseEntity.ok(
                analysisService.getSiteCost(companyId)
        );
    }

}
