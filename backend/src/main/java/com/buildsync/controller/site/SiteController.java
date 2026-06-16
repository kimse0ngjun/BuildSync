package com.buildsync.controller.site;

import com.buildsync.dto.site.SiteDashboardResponse;
import com.buildsync.dto.site.SiteRequest;
import com.buildsync.dto.site.SiteResponse;
import com.buildsync.service.site.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {

    private final SiteService siteService;

    // 공사현장 등록
    @PostMapping
    public SiteResponse createSite(
            Authentication authentication,
            @RequestBody SiteRequest request
    ) {
        String loginId = authentication.getName();

        return siteService.createSite(loginId, request);
    }

    // 공사현장 목록 조회 + 통계 카드 + 검색/필터
    @GetMapping
    public SiteDashboardResponse getSites(
            Authentication authentication,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "constructionType", required = false) String constructionType,
            @RequestParam(value = "status", required = false) String status
    ) {
        String loginId = authentication.getName();

        return siteService.getSites(loginId, keyword, constructionType, status);
    }

    // 공사현장 수정
    @PutMapping("/{siteId}")
    public SiteResponse updateSite(
            Authentication authentication,
            @PathVariable("siteId") Long siteId,
            @RequestBody SiteRequest request
    ) {
        String loginId = authentication.getName();

        return siteService.updateSite(loginId, siteId, request);
    }

    // 공사현장 삭제
    @DeleteMapping("/{siteId}")
    public String deleteSite(
            Authentication authentication,
            @PathVariable("siteId") Long siteId
    ) {
        String loginId = authentication.getName();

        siteService.deleteSite(loginId, siteId);

        return "공사 현장이 삭제되었습니다.";
    }
}