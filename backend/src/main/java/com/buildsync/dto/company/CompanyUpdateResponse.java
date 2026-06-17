package com.buildsync.dto.company;

import java.time.LocalDate;

import com.buildsync.entity.CompanyType;

import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class CompanyUpdateResponse {

    private Long companyId;

    private CompanyType companyType;

    private String companyName;

    private String ceoName;

    private String businessNumber;

    private String phone;

    private String homepageUrl;

    private String address;

    public static CompanyUpdateResponse from(
            com.buildsync.entity.Company company
    ){

        return CompanyUpdateResponse.builder()

                .companyId(
                    company.getId()
                )

                .companyType(
                    company.getCompanyType()
                )

                .companyName(
                    company.getCompanyName()
                )

                .ceoName(
                    company.getCeoName()
                )

                .businessNumber(
                    company.getBusinessNumber()
                )

                .phone(
                    company.getPhone()
                )

                .homepageUrl(
                    company.getHomepageUrl()
                )

                .address(
                    company.getAddress()
                )

                .build();
    }
}