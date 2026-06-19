package com.buildsync.service.site;

import com.buildsync.dto.site.SiteMaterialUsageDashboardResponse;
import com.buildsync.dto.site.SiteMaterialUsageResponse;
import com.buildsync.entity.StockInout;
import com.buildsync.repository.inout.StockInoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
            String keyword,
            Pageable pageable
    ) {
        // 테이블 목록용: 검색/현장/자재/페이징 적용
        Page<StockInout> usagePage = stockInoutRepository.findSiteMaterialUsages(
                loginId,
                siteId,
                materialId,
                keyword,
                pageable
        );

        Page<SiteMaterialUsageResponse> usages =
                usagePage.map(SiteMaterialUsageResponse::from);

        // 통계 카드용: 필터/검색/페이징 영향 없이 로그인한 회사의 전체 사용내역 기준
        List<StockInout> allUsagesForSummary =
                stockInoutRepository.findAllSiteMaterialUsagesForSummary(loginId);

        long totalUsageCount = allUsagesForSummary.size();

        long usedMaterialCount = allUsagesForSummary.stream()
                .map(usage -> usage.getMaterial().getId())
                .distinct()
                .count();

        long usedSiteCount = allUsagesForSummary.stream()
                .map(usage -> usage.getSite().getId())
                .distinct()
                .count();

        long contactCount = allUsagesForSummary.stream()
                .filter(usage -> usage.getContact() != null)
                .map(usage -> usage.getContact().getContactId())
                .distinct()
                .count();

        return SiteMaterialUsageDashboardResponse.builder()
                .totalUsageCount(totalUsageCount)
                .usedMaterialCount(usedMaterialCount)
                .usedSiteCount(usedSiteCount)
                .contactCount(contactCount)
                .currentPage(usagePage.getNumber())
                .pageSize(usagePage.getSize())
                .totalElements(usagePage.getTotalElements())
                .totalPages(usagePage.getTotalPages())
                .usages(usages.getContent())
                .build();
    }
}