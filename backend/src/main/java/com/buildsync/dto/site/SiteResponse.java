package com.buildsync.dto.site;

import com.buildsync.entity.Site;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class SiteResponse {

    private Long id;
    private String siteName;
    private String constructionType;
    private String address;
    private Integer cost;
    private String status;
    private LocalDate startDate;
    private LocalDate expectedEndDate;

    public static SiteResponse from(Site site) {
        return new SiteResponse(
                site.getId(),
                site.getSiteName(),
                site.getConstructionType(),
                site.getAddress(),
                site.getCost(),
                site.getStatus(),
                site.getStartDate(),
                site.getExpectedEndDate()
        );
    }
}