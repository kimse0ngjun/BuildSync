package com.buildsync.dto.schedule;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ScheduleResponse {

    private Long scheduleId;
    private String title;
    private String content;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long siteId;
    private String siteName;
}