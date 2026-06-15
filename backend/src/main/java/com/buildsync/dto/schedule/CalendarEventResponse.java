package com.buildsync.dto.schedule;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CalendarEventResponse {
    private Long eventId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String eventType;

    private Long siteId;
    private String siteName;
    private Long supplierId;
    private String supplierName;
}
