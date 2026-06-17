package com.buildsync.service.site;

import com.buildsync.dto.site.SiteMaterialUsageDashboardResponse;
import com.buildsync.dto.site.SiteMaterialUsageResponse;
import com.buildsync.entity.StockInout;
import com.buildsync.repository.inout.StockInoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteMaterialUsageService {

    private final StockInoutRepository stockInoutRepository;

    public SiteMaterialUsageDashboardResponse getSiteMaterialUsages(
            String loginId,
            Long siteId,
            Long materialId,
            String keyword
    ) {
        List<StockInout> usageList = stockInoutRepository.findSiteMaterialUsages(
                loginId,
                siteId,
                materialId,
                keyword
        );

        List<SiteMaterialUsageResponse> usages = usageList.stream()
                .map(SiteMaterialUsageResponse::from)
                .toList();

        long usedMaterialCount = usageList.stream()
                .map(usage -> usage.getMaterial().getId())
                .distinct()
                .count();

        long usedSiteCount = usageList.stream()
                .map(usage -> usage.getSite().getId())
                .distinct()
                .count();

        long contactCount = usageList.stream()
                .filter(usage -> usage.getContact() != null)
                .map(usage -> usage.getContact().getContactId())
                .distinct()
                .count();

        return SiteMaterialUsageDashboardResponse.builder()
                .totalUsageCount(usageList.size())
                .usedMaterialCount(usedMaterialCount)
                .usedSiteCount(usedSiteCount)
                .contactCount(contactCount)
                .usages(usages)
                .build();
    }
}