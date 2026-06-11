package com.buildsync.controller.company;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.auth.FindLoginIdRequest;
import com.buildsync.dto.auth.FindPasswordEmailRequest;
import com.buildsync.dto.auth.FindPasswordRequest;
import com.buildsync.dto.auth.LoginRequest;
import com.buildsync.dto.auth.LoginResponse;
import com.buildsync.dto.auth.SignupRequest;
import com.buildsync.service.auth.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	
	// 로그인
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(
	        @RequestBody LoginRequest req) {

	    return ResponseEntity.ok(authService.login(req));
	}
	
	// 회원가입
	@PostMapping("/signup")
	public ResponseEntity<String> signup(
			@RequestBody SignupRequest req){
		authService.signup(req);
		
		return ResponseEntity.ok("회원가입 성공");
	}
	
	// 아이디 찾기
	@PostMapping("/find-id")
	public ResponseEntity<?> findId(@RequestBody FindLoginIdRequest request) {

	    String loginId = authService.findLoginId(request.getPhone());

	    return ResponseEntity.ok(
	            Map.of("loginId", loginId)
	    );
	}
	
	// 비밀번호 찾기
	@PostMapping("/find-password")
    public ResponseEntity<String> findPassword(@RequestBody FindPasswordEmailRequest request) {

        authService.sendResetPasswordLink(request.getEmail());

        return ResponseEntity.ok("비밀번호 재설정 링크 전송 완료");
    }
    
    
	// 비밀번호 재설정
	@PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody FindPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok("비밀번호 변경 완료");
    }
	
	
}
