package com.buildsync.dto.admin;

import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminCompanyResponse {

    private Long companyId;
    private String loginId;
    private String companyType;
    private String companyName;
    private String ceoName;
    private String businessNumber;
    private String phone;
    private String homepageUrl;
    private String address;
    private String email;
    private LocalDateTime createdAt;
    private CompanyStatus status;

    public static AdminCompanyResponse from(Company company) {
        return AdminCompanyResponse.builder()
                .companyId(company.getId())
                .loginId(company.getLoginId())
                .companyType(company.getCompanyType())
                .companyName(company.getCompanyName())
                .ceoName(company.getCeoName())
                .businessNumber(company.getBusinessNumber())
                .phone(company.getPhone())
                .homepageUrl(company.getHomepageUrl())
                .address(company.getAddress())
                .email(company.getEmail())
                .createdAt(company.getCreatedAt())
                .status(company.getStatus())
                .build();
    }
}