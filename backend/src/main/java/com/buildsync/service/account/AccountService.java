package com.buildsync.service.account;

import com.buildsync.dto.company.AccountDeleteRequest;
import com.buildsync.dto.company.AccountPasswordChangeRequest;
import com.buildsync.dto.company.AccountResponse;
import com.buildsync.dto.company.AccountUpdateRequest;

public interface AccountService {
	
	AccountResponse getCompanyAccount(Long companyId);
	
	void updateCompanyAccount(
			Long companyId,
			AccountUpdateRequest req);
	
	void deleteCompanyAccount(
	        String loginId,
	        AccountDeleteRequest request
	);
	
	void changePassword(
			String loginId,
			AccountPasswordChangeRequest request);
}