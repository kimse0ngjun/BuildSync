package com.buildsync.controller.account;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.company.AccountDeleteRequest;
import com.buildsync.dto.company.AccountPasswordChangeRequest;
import com.buildsync.dto.company.AccountResponse;
import com.buildsync.dto.company.AccountUpdateRequest;
import com.buildsync.service.account.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class AccountController {
	
	private final AccountService accountService;

	// 거래처 정보 조회
    @GetMapping("/{companyId}/account")
    public ResponseEntity<AccountResponse> getCompanyAccount(
            @PathVariable("companyId") Long companyId) {

        AccountResponse response =
                accountService.getCompanyAccount(companyId);

        return ResponseEntity.ok(response);
    }

    // 거래처 정보 수정
    @PutMapping("/{companyId}/account")
    public ResponseEntity<String> updateCompanyAccount(
            @PathVariable("companyId") Long companyId,
            @Valid @RequestBody AccountUpdateRequest request) {

        accountService.updateCompanyAccount(companyId, request);

        return ResponseEntity.ok("업체 정보가 수정되었습니다.");
    }
    
    // 로그인 후 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestBody AccountPasswordChangeRequest request
    ) {

        String loginId = authentication.getName();

        accountService.changePassword(loginId, request);

        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }
    
    // 거래처 정보 삭제(비활성화)
    @DeleteMapping
    public ResponseEntity<String> deleteCompanyAccount(
            Authentication authentication,
            @RequestBody AccountDeleteRequest request) {

        String loginId = authentication.getName();


        accountService.deleteCompanyAccount(
                loginId,
                request
        );

        return ResponseEntity.ok(
                "거래처 정보가 삭제되었습니다."
        );
    }
}
