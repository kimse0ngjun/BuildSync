package com.buildsync.dto.company;

import java.time.LocalDate;
import java.util.List;

import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyType;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanyResponse {

    private Long companyId;
    private CompanyType companyType;
    private String companyName;
    private String ceoName;
    private String phone;
    private String address;
    private List<String> materials;
    private LocalDate createdAt;
    
    public static CompanyResponse from(Company company) {

        return CompanyResponse.builder()
                .companyId(company.getId())
                .companyType(company.getCompanyType())
                .companyName(company.getCompanyName())
                .ceoName(company.getCeoName())
                .phone(company.getPhone())
                .address(company.getAddress())
                .createdAt(company.getCreatedAt())
                .materials(List.of())
                .build();
    }
}