package com.buildsync.dto.company;

import java.time.LocalDateTime;

import com.buildsync.entity.Company;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanyDetailResponse {

    private Long companyId;
    private String companyType;
    private String companyName;
    private String ceoName;
    private String businessNumber;
    private String phone;
    private String homepageUrl;
    private String address;
    private LocalDateTime createdAt;


    public static CompanyDetailResponse from(
            Company company
    ){

        return CompanyDetailResponse.builder()
                .companyId(company.getId())
                .companyType(company.getCompanyType().name())
                .companyName(company.getCompanyName())
                .ceoName(company.getCeoName())
                .businessNumber(company.getBusinessNumber())
                .phone(company.getPhone())
                .homepageUrl(company.getHomepageUrl())
                .address(company.getAddress())
                .createdAt(company.getCreatedAt())
                .build();
    }
}