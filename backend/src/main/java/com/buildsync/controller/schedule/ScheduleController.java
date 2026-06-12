package com.buildsync.controller.schedule;

import com.buildsync.dto.schedule.CalendarEventResponse;
import com.buildsync.dto.schedule.ScheduleRequest;
import com.buildsync.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 일정 등록
    @PostMapping
    public ResponseEntity<Long> createSchedule(
            @RequestParam("companyId") Long companyId,
            @RequestBody ScheduleRequest request
    ) {
        return ResponseEntity.ok(scheduleService.createSchedule(companyId, request));
    }

    // 일정 수정
    @PutMapping("/{scheduleId}")
    public ResponseEntity<Long> updateSchedule(
            @RequestParam("companyId") Long companyId,
            @PathVariable("scheduleId") Long scheduleId,
            @RequestBody ScheduleRequest request
    ) {
        return ResponseEntity.ok(scheduleService.updateSchedule(companyId, scheduleId, request));
    }

    // 일정 삭제
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(
            @RequestParam("companyId") Long companyId,
            @PathVariable("scheduleId") Long scheduleId
    ) {
        scheduleService.deleteSchedule(companyId, scheduleId);
        return ResponseEntity.ok("일정이 삭제되었습니다.");
    }
}