package com.buildsync.dto.company;

import java.time.LocalDateTime;

import com.buildsync.entity.CompanyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class AccountResponse { // 거래처 등록

    private String loginId;
    private CompanyType companyType;
    private String companyName;
    private String ceoName;
    private String businessNumber;
    private String homepageUrl;
	private String phone;
    private String address;
    private LocalDateTime createdAt;
}
