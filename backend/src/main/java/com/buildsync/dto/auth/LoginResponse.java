package com.buildsync.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

	private String token;
	private Long companyId;
	private String ceoName;
	private String companyName;
	private String companyType;
	private Long contactId;
}
