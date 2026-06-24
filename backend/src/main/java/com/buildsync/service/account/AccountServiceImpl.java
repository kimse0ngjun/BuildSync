package com.buildsync.service.account;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.company.AccountDeleteRequest;
import com.buildsync.dto.company.AccountPasswordChangeRequest;
import com.buildsync.dto.company.AccountResponse;
import com.buildsync.dto.company.AccountUpdateRequest;
import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyStatus;
import com.buildsync.repository.company.CompanyRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

	private final CompanyRepository companyRepository;
	private final PasswordEncoder passwordEncoder;
	
	// 거래처 정보 조회
	@Override
	public AccountResponse getCompanyAccount(Long companyId) {

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("회사를 찾을 수 없습니다."));

        return AccountResponse.builder()
                .loginId(company.getLoginId())
                .companyType(company.getCompanyType())
                .companyName(company.getCompanyName())
                .ceoName(company.getCeoName())
                .businessNumber(company.getBusinessNumber())
                .phone(company.getPhone())
                .homepageUrl(company.getHomepageUrl())
                .address(company.getAddress())
                .createdAt(company.getCreatedAt())
                .build();
    }
	
	
	// 거래처 정보 수정
	@Override
	@Transactional
	public void updateCompanyAccount(
            Long companyId,
            AccountUpdateRequest request) {
		
		Company company = companyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("회사를 찾을 수 없습니다."));

        company.setCompanyName(request.getCompanyName());
        company.setCeoName(request.getCeoName());
        company.setPhone(request.getPhone());
        company.setHomepageUrl(request.getHomepageUrl());
        company.setAddress(request.getAddress());
	}
	
	// 로그인 후 비밀번호 변경
	@Transactional
	@Override
	public void changePassword(
	        String loginId,
	        AccountPasswordChangeRequest request
	) {

	    Company company = companyRepository.findByLoginId(loginId)
	            .orElseThrow(() ->
	                new IllegalArgumentException("회사를 찾을 수 없습니다.")
	            );


	    if(!passwordEncoder.matches(
	            request.getCurrentPassword(),
	            company.getPassword()
	    )) {
	        throw new IllegalArgumentException(
	                "현재 비밀번호가 일치하지 않습니다."
	        );
	    }


	    company.setPassword(
	        passwordEncoder.encode(
	            request.getNewPassword()
	        )
	    );
	}
	
	// 거래처 정보 삭제
	@Transactional
	@Override
	public void deleteCompanyAccount(
	        String loginId,
	        AccountDeleteRequest request
	) {

	    Company company =
	            companyRepository.findByLoginId(loginId)
	            .orElseThrow(() ->
	                new IllegalArgumentException(
	                    "회사를 찾을 수 없습니다."
	                )
	            );

	    if(!passwordEncoder.matches(
	            request.getPassword(),
	            company.getPassword()
	    )) {

	        throw new IllegalArgumentException(
	            "비밀번호가 일치하지 않습니다."
	        );

	    }

	    company.setStatus(
	        CompanyStatus.INACTIVE
	    );

	}
}
