package com.buildsync.service.auth;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.buildsync.config.JwtConfig;
import com.buildsync.config.JwtUtil;
import com.buildsync.dto.auth.FindPasswordRequest;
import com.buildsync.dto.auth.LoginRequest;
import com.buildsync.dto.auth.LoginResponse;
import com.buildsync.dto.auth.SignupRequest;
import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyStatus;
import com.buildsync.entity.Contact;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.company.ContactRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final CompanyRepository companyRepository;
	private final ContactRepository contactRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final MailService mailService;
	

	// 로그인
	public LoginResponse login(LoginRequest req) {

	    Company company = companyRepository.findByLoginId(req.getLoginId())
	            .orElseThrow(() -> 
	                new RuntimeException("아이디가 존재하지 않습니다.")
	            );


	    if (!passwordEncoder.matches(
	            req.getPassword(),
	            company.getPassword()
	    )) {
	        throw new RuntimeException("비밀번호가 일치하지 않습니다.");
	    }


	    if (company.getStatus() == CompanyStatus.PENDING) {
	        throw new RuntimeException("관리자 승인 대기 중입니다.");
	    }


	    if (company.getStatus() == CompanyStatus.REJECTED) {
	        throw new RuntimeException("가입 요청이 반려되었습니다.");
	    }


	    if (company.getStatus() == CompanyStatus.INACTIVE) {
	        throw new RuntimeException("비활성 계정입니다.");
	    }

	    String token =
	            jwtUtil.generateToken(company.getLoginId());


	    return new LoginResponse(
	            token,
	            company.getId(),
	            company.getCeoName(),
	            company.getCompanyName(),
	            company.getCompanyType().name()
	    );
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
	        company.setPhone(formatPhone(req.getPhone()));
	        company.setHomepageUrl(req.getHomepageUrl());
	        company.setAddress(req.getAddress());
	        company.setEmail(req.getEmail());
	        company.setCreatedAt(LocalDateTime.now());

	        company.setStatus(CompanyStatus.PENDING);
	        
	        companyRepository.save(company);
	    }
	 
	 // 아이디 찾기
	 public String findLoginId(String phone) {

		    String formattedPhone = formatPhone(phone);

		    Company company = companyRepository.findByPhone(formattedPhone)
		            .orElseThrow(() -> new RuntimeException("해당 전화번호가 존재하지 않습니다."));

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

		    String link = "http://localhost:5173/reset-password?token=" + token;

		    try {
		        mailService.sendResetPasswordMail(email, link);
		    } catch (Exception e) {
		        throw new RuntimeException("메일 전송 실패");
		    }
		}
	 
	 // 휴대전화 하이폰 처리
	 private String formatPhone(String phone) {

	        String number = phone.replaceAll("[^0-9]", "");

	        if (number.length() == 11) {
	            return number.replaceFirst(
	                    "(\\d{3})(\\d{4})(\\d{4})",
	                    "$1-$2-$3"
	            );
	        }

	        return phone;
	    }
	 
	 // 회원 삭제
	 public void deleteAccount(String loginId) {
		 
		 Company company  = companyRepository.findByLoginId(loginId)
		            .orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다."));
		 
		    company.setStatus(CompanyStatus.INACTIVE);

		    companyRepository.save(company);
	 }
}
