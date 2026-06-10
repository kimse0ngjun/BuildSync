package com.buildsync.service;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.buildsync.config.JwtConfig;
import com.buildsync.config.JwtUtil;
import com.buildsync.dto.FindPasswordRequest;
import com.buildsync.dto.LoginRequest;
import com.buildsync.dto.SignupRequest;
import com.buildsync.entity.Company;
import com.buildsync.repository.company.CompanyRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final CompanyRepository companyRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final JwtConfig jwtConfig;
	private final MailService mailService;
	

	// 로그인
    public String login(LoginRequest req) {

        Company company = companyRepository.findByLoginId(req.getLoginId())
                .orElseThrow(() -> new RuntimeException("아이디가 존재하지 않습니다."));

        if (!passwordEncoder.matches(req.getPassword(), company.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return jwtUtil.generateToken(company.getLoginId());
    }
	
	// 회원가입
	 public void signup(SignupRequest req) {

	        if (companyRepository.existsByLoginId(req.getLoginId())) {
	            throw new RuntimeException("이미 사용 중인 아이디입니다.");
	        }
	        
	        if (companyRepository.existsByEmail(req.getEmail())) {
	            throw new RuntimeException("이미 사용 중인 이메일입니다.");
	        }

	        Company company = new Company();

	        company.setLoginId(req.getLoginId());
	        company.setPassword(
	                passwordEncoder.encode(req.getPassword())
	        );

	        company.setCompanyType(req.getCompanyType());
	        company.setCompanyName(req.getCompanyName());
	        company.setCeoName(req.getCeoName());
	        company.setBusinessNumber(req.getBusinessNumber());
	        company.setPhone(req.getPhone());
	        company.setHomepageUrl(req.getHomepageUrl());
	        company.setAddress(req.getAddress());
	        company.setEmail(req.getEmail());

	        companyRepository.save(company);
	    }
	 
	 // 아이디 찾기
	 public String findLoginId(String email) {

		    Company company = companyRepository.findByEmail(email)
		            .orElseThrow(() -> new RuntimeException("해당 이메일이 존재하지 않습니다."));

		    return company.getLoginId();
		}
	 
	 // 비밀번호 찾기
	 public void resetPassword(FindPasswordRequest req) {

		    try {
		    	String loginId = jwtUtil.getLoginId(req.getToken());

		        Company company = companyRepository.findByLoginId(loginId)
		                .orElseThrow(() -> new RuntimeException("유효하지 않은 사용자입니다."));

		        company.setPassword(passwordEncoder.encode(req.getNewPassword()));

		        companyRepository.save(company);

		    } catch (Exception e) {
		        throw new RuntimeException("링크가 만료되었거나 유효하지 않습니다.");
		    }
		}
	 
	 // 비밀번호 재설정 링크 발송
	 public void sendResetPasswordLink(String email) {

		    Company company = companyRepository.findByEmail(email)
		            .orElseThrow(() -> new RuntimeException("해당 이메일이 존재하지 않습니다."));

		    String token = jwtUtil.generateResetToken(company.getLoginId());

		    String link = "http://localhost:3000/reset-password?token=" + token;

		    try {
		        mailService.sendResetPasswordMail(email, link);
		    } catch (Exception e) {
		        throw new RuntimeException("메일 전송 실패");
		    }
		}
}
