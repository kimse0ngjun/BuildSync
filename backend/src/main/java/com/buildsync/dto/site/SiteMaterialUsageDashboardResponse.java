package com.buildsync.dto.site;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SiteMaterialUsageDashboardResponse {

    private long totalUsageCount;
    private long usedMaterialCount;
    private long usedSiteCount;
    private long contactCount;

    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;

    private List<SiteMaterialUsageResponse> usages;
}