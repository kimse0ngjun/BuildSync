package com.buildsync.dto.site;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SiteDashboardResponse {

    private long totalSiteCount;
    private long progressCount;
    private long plannedCount;
    private long completedCount;

    private List<SiteResponse> sites;
    
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}