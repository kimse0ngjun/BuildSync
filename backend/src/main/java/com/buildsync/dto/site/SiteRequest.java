package com.buildsync.dto.site;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SiteRequest {

    private String siteName;
    private String constructionType;
    private String address;
    private Integer cost;
    private String status;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
}