package com.buildsync.service.analysis;

import java.util.List;

import org.springframework.stereotype.Service;

import com.buildsync.dto.analysis.MonthlyOrderCostResponse;
import com.buildsync.dto.analysis.SiteCostResponse;
import com.buildsync.repository.analysis.AnalysisRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalysisService {

	private final AnalysisRepository analysisRepository;
	
	// 월별 발주 비용 분석
	public List<MonthlyOrderCostResponse> getMonthlyCost(Long companyId) {
		return analysisRepository.findMonthlyCost(companyId);
	}
	
	// 현장별 발주 비용 분석
    public List<SiteCostResponse> getSiteCost(Long companyId) {
        return analysisRepository.findSiteCost(companyId);
    }
}
