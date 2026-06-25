package com.buildsync.service.analysis;


import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.analysis.MonthlyPurchaseProjection;
import com.buildsync.dto.analysis.SiteMaterialUsageProjection;
import com.buildsync.repository.analysis.CompanyAnalysisRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyAnalysisService {


    private final CompanyAnalysisRepository repository;



    // 월별 자재 구매 비용
    public List<MonthlyPurchaseProjection>
    getMonthlyPurchase(Long companyId) {


        return repository
                .findMonthlyPurchase(companyId);
    }




    // 현장별 자재 사용 합계
    public List<SiteMaterialUsageProjection>
    getSiteUsage(Long companyId) {


        return repository
                .findSiteUsage(companyId);
    }

}