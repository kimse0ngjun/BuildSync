package com.buildsync.dto.admin;

import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminRecentCompanyResponse {

    private Long companyId;
    private String companyName;
    private CompanyType companyType;
    private LocalDateTime createdAt;

    public static AdminRecentCompanyResponse from(Company company) {
        return AdminRecentCompanyResponse.builder()
                .companyId(company.getId())
                .companyName(company.getCompanyName())
                .companyType(company.getCompanyType())
                .createdAt(company.getCreatedAt())
                .build();
    }
}