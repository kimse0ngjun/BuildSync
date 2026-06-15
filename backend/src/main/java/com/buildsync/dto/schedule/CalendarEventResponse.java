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
	private String eventType;
	private String status;
	private String site;
	private String supplier;
}
