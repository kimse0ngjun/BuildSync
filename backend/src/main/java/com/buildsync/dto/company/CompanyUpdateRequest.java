package com.buildsync.dto.company;

import com.buildsync.entity.CompanyType;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CompanyUpdateRequest {


    private CompanyType companyType;
    private String companyName;
    private String ceoName;
    private String businessNumber;
    private String phone;
    private String homepageUrl;
    private String address;
}