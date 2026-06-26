package com.buildsync.service.analysis;


import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.analysis.MonthlySalesProjection;
import com.buildsync.dto.analysis.SiteMaterialCostProjection;
import com.buildsync.repository.analysis.SupplierAnalysisRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SupplierAnalysisService {


    private final SupplierAnalysisRepository repository;



    // 월별 판매 비용
    public List<MonthlySalesProjection> getMonthlySales(
            Long companyId
    ){

        return repository.findMonthlySales(companyId);
    }





    // 현장별 자재 판매 비용
    public List<SiteMaterialCostProjection> getSiteMaterialCost(
            Long companyId
    ){

        return repository.findSiteMaterialCost(companyId);
    }

}