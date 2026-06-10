package com.buildsync.controller.company;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.FindLoginIdRequest;
import com.buildsync.dto.FindPasswordEmailRequest;
import com.buildsync.dto.FindPasswordRequest;
import com.buildsync.dto.LoginRequest;
import com.buildsync.dto.SignupRequest;
import com.buildsync.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	
	// 로그인
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest req) {

	    String token = authService.login(req);

	    return ResponseEntity.ok(
	            Map.of("token", token)
	    );
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

	    String loginId = authService.findLoginId(request.getEmail());

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
