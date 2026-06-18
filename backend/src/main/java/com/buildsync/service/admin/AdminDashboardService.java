package com.buildsync.service.admin;

import com.buildsync.dto.admin.AdminDashboardResponse;
import com.buildsync.dto.admin.AdminRecentCompanyResponse;
import com.buildsync.entity.CompanyStatus;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.material.MaterialRepository;
import com.buildsync.repository.site.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final CompanyRepository companyRepository;
    private final SiteRepository siteRepository;
    private final MaterialRepository materialRepository;

    public AdminDashboardResponse getDashboard() {

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime tomorrowStart = todayStart.plusDays(1);

        LocalDateTime monthStart = LocalDate.now()
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime nextMonthStart = monthStart.plusMonths(1);

        return AdminDashboardResponse.builder()
                .pendingCompanyCount(companyRepository.countByStatus(CompanyStatus.PENDING))
                .totalCompanyCount(companyRepository.count())
                .totalSiteCount(siteRepository.count())
                .totalMaterialCount(materialRepository.count())

                .todaySignupCount(companyRepository.countByCreatedAtBetween(todayStart, tomorrowStart))
                .monthlySignupCount(companyRepository.countByCreatedAtBetween(monthStart, nextMonthStart))
                .activeCompanyCount(companyRepository.countByStatus(CompanyStatus.ACTIVE))
                .monthlyMaterialCount(materialRepository.countByCreatedAtBetween(monthStart, nextMonthStart))
                .systemUserCount(companyRepository.count())

                .recentCompanies(
                        companyRepository.findTop5ByOrderByCreatedAtDesc()
                                .stream()
                                .map(AdminRecentCompanyResponse::from)
                                .toList()
                )
                .build();
    }
}