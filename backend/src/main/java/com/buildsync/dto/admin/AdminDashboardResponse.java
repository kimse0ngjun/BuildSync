package com.buildsync.dto.admin;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AdminDashboardResponse {

    private long pendingCompanyCount;
    private long totalCompanyCount;
    private long totalSiteCount;
    private long totalMaterialCount;

    private long todaySignupCount;
    private long monthlySignupCount;
    private long activeCompanyCount;
    private long monthlyMaterialCount;
    private long systemUserCount;

    private List<AdminRecentCompanyResponse> recentCompanies;
}