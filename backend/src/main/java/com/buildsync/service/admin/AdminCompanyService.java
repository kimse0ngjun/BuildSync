package com.buildsync.service.admin;

import com.buildsync.dto.admin.AdminCompanyResponse;
import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyStatus;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.service.auth.MailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCompanyService {

    private final CompanyRepository companyRepository;
    private final MailService mailService;

    // 승인 대기 업체 목록 조회
    public List<AdminCompanyResponse> getPendingCompanies() {
        return companyRepository.findByStatus(CompanyStatus.PENDING)
                .stream()
                .map(AdminCompanyResponse::from)
                .toList();
    }

    // 업체 승인
    public AdminCompanyResponse approveCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));

        company.setStatus(CompanyStatus.ACTIVE);

        Company savedCompany = companyRepository.save(company);

        try {
            mailService.sendApprovalMail(savedCompany.getEmail(), savedCompany.getCompanyName());
        } catch (MessagingException e) {
            throw new RuntimeException("승인 메일 전송에 실패했습니다.");
        }

        return AdminCompanyResponse.from(savedCompany);
    }

    // 업체 반려
    public AdminCompanyResponse rejectCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));

        company.setStatus(CompanyStatus.REJECTED);

        Company savedCompany = companyRepository.save(company);

        try {
            mailService.sendRejectMail(savedCompany.getEmail(), savedCompany.getCompanyName());
        } catch (MessagingException e) {
            throw new RuntimeException("반려 메일 전송에 실패했습니다.");
        }

        return AdminCompanyResponse.from(savedCompany);
    }
}