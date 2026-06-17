package com.buildsync.dto.schedule;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleRequest {

	private String title;
	private String content;
	private LocalDate startDate;
	private LocalDate endDate;
	private Long siteId;
}
