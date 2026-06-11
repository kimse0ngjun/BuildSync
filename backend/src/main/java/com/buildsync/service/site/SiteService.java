package com.buildsync.service.site;

import com.buildsync.dto.site.SiteRequest;
import com.buildsync.dto.site.SiteResponse;
import com.buildsync.entity.Company;
import com.buildsync.entity.Site;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.site.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;
    private final CompanyRepository companyRepository;

    // 공사 현장 등록
    public SiteResponse createSite(String loginId, SiteRequest request) {

        Company company = getCompanyByLoginId(loginId);

        Site site = Site.builder()
                .siteName(request.getSiteName())
                .constructionType(request.getConstructionType())
                .address(request.getAddress())
                .cost(request.getCost())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .expectedEndDate(request.getExpectedEndDate())
                .company(company)
                .build();

        Site savedSite = siteRepository.save(site);

        return SiteResponse.from(savedSite);
    }

    // 공사 현장 목록 조회
    public List<SiteResponse> getSites(String loginId) {

        Company company = getCompanyByLoginId(loginId);

        return siteRepository.findByCompany(company)
                .stream()
                .map(SiteResponse::from)
                .toList();
    }

    // 공사 현장 수정
    public SiteResponse updateSite(String loginId, Long siteId, SiteRequest request) {

        Company company = getCompanyByLoginId(loginId);

        Site site = siteRepository.findByIdAndCompany(siteId, company)
                .orElseThrow(() -> new RuntimeException("공사 현장을 찾을 수 없습니다."));

        site.setSiteName(request.getSiteName());
        site.setConstructionType(request.getConstructionType());
        site.setAddress(request.getAddress());
        site.setCost(request.getCost());
        site.setStatus(request.getStatus());
        site.setStartDate(request.getStartDate());
        site.setExpectedEndDate(request.getExpectedEndDate());

        Site updatedSite = siteRepository.save(site);

        return SiteResponse.from(updatedSite);
    }

    // 공사 현장 삭제
    public void deleteSite(String loginId, Long siteId) {

        Company company = getCompanyByLoginId(loginId);

        Site site = siteRepository.findByIdAndCompany(siteId, company)
                .orElseThrow(() -> new RuntimeException("공사 현장을 찾을 수 없습니다."));

        siteRepository.delete(site);
    }

    // 로그인 아이디로 회사 조회
    private Company getCompanyByLoginId(String loginId) {
        return companyRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("회사를 찾을 수 없습니다."));
    }
}