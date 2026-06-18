package com.buildsync.service.site;

import com.buildsync.dto.site.SiteMaterialUsageDashboardResponse;
import com.buildsync.dto.site.SiteMaterialUsageResponse;
import com.buildsync.entity.StockInout;
import com.buildsync.repository.inout.StockInoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteMaterialUsageService {

    private final StockInoutRepository stockInoutRepository;

    public SiteMaterialUsageDashboardResponse getSiteMaterialUsages(
            String loginId,
            Long siteId,
            Long materialId,
            String keyword,
            Pageable pageable
    ) {
        Page<StockInout> usagePage = stockInoutRepository.findSiteMaterialUsages(
                loginId,
                siteId,
                materialId,
                keyword,
                pageable
        );

        Page<SiteMaterialUsageResponse> usages =
                usagePage.map(SiteMaterialUsageResponse::from);

        return SiteMaterialUsageDashboardResponse.builder()
                .totalUsageCount(usagePage.getTotalElements())
                .usedMaterialCount(
                        usagePage.getContent().stream()
                                .map(usage -> usage.getMaterial().getId())
                                .distinct()
                                .count()
                )
                .usedSiteCount(
                        usagePage.getContent().stream()
                                .map(usage -> usage.getSite().getId())
                                .distinct()
                                .count()
                )
                .contactCount(
                        usagePage.getContent().stream()
                                .filter(usage -> usage.getContact() != null)
                                .map(usage -> usage.getContact().getContactId())
                                .distinct()
                                .count()
                )
                .currentPage(usagePage.getNumber())
                .pageSize(usagePage.getSize())
                .totalElements(usagePage.getTotalElements())
                .totalPages(usagePage.getTotalPages())
                .usages(usages.getContent())
                .build();
    }
}