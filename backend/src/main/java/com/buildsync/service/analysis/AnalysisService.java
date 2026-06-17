package com.buildsync.service.analysis;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.analysis.MonthlyMaterialCostResponse;
import com.buildsync.dto.analysis.SiteMaterialUsageAnalysisResponse;
import com.buildsync.repository.analysis.AnalysisRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {

    private final AnalysisRepository repository;

    public List<MonthlyMaterialCostResponse>
    getMonthlyMaterialCost(Long companyId) {


        return repository
                .findMonthlyMaterialCost(companyId)
                .stream()
                .map(item ->

                    MonthlyMaterialCostResponse.builder()

                    .month(item.getMonth())

                    .inboundQuantity(
                        item.getInboundQuantity()
                    )

                    .totalOrderAmount(
                        item.getTotalOrderAmount()
                    )

                    .totalMaterialCost(
                        item.getTotalMaterialCost()
                    )

                    .build()

                )
                .toList();
    }



    public List<SiteMaterialUsageAnalysisResponse>
    getSiteMaterialUsage(Long companyId) {


        return repository
                .findSiteMaterialUsage(companyId)
                .stream()
                .map(item ->

                    SiteMaterialUsageAnalysisResponse.builder()

                    .siteId(
                        item.getSiteId()
                    )

                    .siteName(
                        item.getSiteName()
                    )

                    .materialName(
                        item.getMaterialName()
                    )

                    .inboundQuantity(
                        item.getInboundQuantity()
                    )

                    .outboundQuantity(
                        item.getOutboundQuantity()
                    )

                    .currentStock(
                        item.getCurrentStock()
                    )

                    .unitPrice(
                        item.getUnitPrice()
                    )

                    .build()

                )
                .toList();
    }
}
