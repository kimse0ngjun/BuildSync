package com.buildsync.dto.auth;

import com.buildsync.entity.CompanyType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

	// 로그인 정보
    private String loginId;
    private String password;

    // 업체 정보
    private CompanyType companyType;
    private String companyName;
    private String ceoName;

    private String businessNumber;
    private String phone;
    private String homepageUrl;
    private String address;
    private String email;
}