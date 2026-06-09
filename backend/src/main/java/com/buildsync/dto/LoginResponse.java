package com.buildsync.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

	private String accessToken;
	private String loginId;
	private String companyName;
}
