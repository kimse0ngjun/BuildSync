package com.buildsync.controller.schedule;

import com.buildsync.dto.paging.PageResponse;
import com.buildsync.dto.schedule.CalendarEventResponse;
import com.buildsync.dto.schedule.ScheduleRequest;
import com.buildsync.dto.schedule.ScheduleResponse;
import com.buildsync.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // 캘린더 조회
    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarEventResponse>> getCalendarEvents(
            @RequestParam("companyId") Long companyId,
            @RequestParam("year") int year,
            @RequestParam("month") int month,
            @RequestParam(value = "type", defaultValue = "ALL") String type,
            @RequestParam(value = "status", defaultValue = "ALL") String status
    ) {
        return ResponseEntity.ok(
            scheduleService.getCalendarEvents(companyId, year, month, type, status)
        );
    }
    
    // 일정 게시판 조회
    @GetMapping("/list")
    public ResponseEntity<PageResponse<ScheduleResponse>> getScheduleList(
            @RequestParam("companyId") Long companyId,
            @PageableDefault(
            		size = 10,
            		sort = "startDate",
            		direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                scheduleService.getScheduleList(
                        companyId,
                        pageable
                )
        );
    }
    
    // 상세 조회
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ScheduleResponse> getSchedule(
            @RequestParam("companyId") Long companyId,
            @PathVariable("scheduleId") Long scheduleId
    ) {

        return ResponseEntity.ok(
            scheduleService.getSchedule(companyId, scheduleId)
        );
    }
    		
    // 일정 등록
    @PostMapping
    public ResponseEntity<ScheduleResponse> createSchedule(
            @RequestParam("companyId") Long companyId,
            @RequestBody ScheduleRequest request
    ) {
        return ResponseEntity.ok(
                scheduleService.createSchedule(companyId, request)
        );
    }

    // 일정 수정
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ScheduleResponse> updateSchedule(
            @RequestParam("companyId") Long companyId,
            @PathVariable("scheduleId") Long scheduleId,
            @RequestBody ScheduleRequest request
    ) {
        return ResponseEntity.ok(
                scheduleService.updateSchedule(
                        companyId,
                        scheduleId,
                        request
                )
        );
    }

    // 일정 삭제
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Map<String, String>> deleteSchedule(
            @RequestParam("companyId") Long companyId,
            @RequestParam("type") String type,
            @PathVariable("eventId") Long eventId
    ) {

        scheduleService.deleteSchedule(
                companyId,
                eventId,
                type
        );

        return ResponseEntity.ok(
                Map.of(
                        "type", type,
                        "eventId", String.valueOf(eventId),
                        "message", "일정이 삭제되었습니다.")
        );
    }
}