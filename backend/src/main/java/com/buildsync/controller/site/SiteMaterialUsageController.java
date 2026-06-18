package com.buildsync.controller.site;

import com.buildsync.dto.site.SiteMaterialUsageDashboardResponse;
import com.buildsync.service.site.SiteMaterialUsageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/site-material-usages")
@RequiredArgsConstructor
public class SiteMaterialUsageController {

    private final SiteMaterialUsageService siteMaterialUsageService;

    // 현장별 자재 사용 내역 조회 + 페이징
    @GetMapping
    public SiteMaterialUsageDashboardResponse getSiteMaterialUsages(
            Authentication authentication,
            @RequestParam(value = "siteId", required = false) Long siteId,
            @RequestParam(value = "materialId", required = false) Long materialId,
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        String loginId = authentication.getName();

        return siteMaterialUsageService.getSiteMaterialUsages(
                loginId,
                siteId,
                materialId,
                keyword,
                pageable
        );
    }
}