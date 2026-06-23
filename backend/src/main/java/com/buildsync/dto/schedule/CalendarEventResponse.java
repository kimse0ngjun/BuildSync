package com.buildsync.dto.schedule;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CalendarEventResponse {

    // 공통
    private Long eventId; // SITES, MATERIALS 
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String eventType; // SITES, MATERIALS

    // 공사 일정(SITES) 전용
    private Long siteId;
    private String siteName;

    // 자재 입고(MATERIALS) 전용
    private Long supplierId;
    private String supplierName;
    private String materialType; // IN, OUT
}