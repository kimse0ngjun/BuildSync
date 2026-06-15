package com.buildsync.service.schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.schedule.CalendarEventResponse;
import com.buildsync.dto.schedule.ScheduleRequest;
import com.buildsync.dto.schedule.ScheduleResponse;
import com.buildsync.entity.Schedule;
import com.buildsync.entity.Site;
import com.buildsync.repository.schedule.ScheduleRepository;
import com.buildsync.repository.site.SiteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final SiteRepository     siteRepository;

//  private final OrderRepository orderRepository;

    // 캘린더 조회
    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getCalendarEvents(
            Long companyId, int year, int month, String type, String status) {

        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay  = firstDay.withDayOfMonth(firstDay.lengthOfMonth());

        List<CalendarEventResponse> events = new ArrayList<>();

        // 공사 현장 일정 (SITES)
        if (!type.equals("MATERIAL")) {
            scheduleRepository
                .findByCompanyIdAndMonth(companyId, firstDay, lastDay)
                .stream()
                .map(this::toConstructionEvent)
                .filter(e -> matchesStatus(e, status))
                .forEach(events::add);
        }

        // 자재 입고 일정 (Orders 브런치 병합 후 작업 예정)
//        if (!type.equals("SITES")) {
//            orderRepository
//                .findDeliveriesByCompanyAndMonth(companyId, firstDay, lastDay)
//                .stream()
//                .map(this::toDeliveryEvent)
//                .filter(e -> matchesStatus(e, status))
//                .forEach(events::add);
//        }

        events.sort(Comparator.comparing(CalendarEventResponse::getStartDate));
        return events;
    }

    // 일정 등록
    @Transactional
    public ScheduleResponse createSchedule(
            Long companyId,
            ScheduleRequest request
    ) {

        Site site = siteRepository.findById(request.getSiteId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 현장입니다."));

        Schedule schedule = Schedule.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .companyId(companyId)
                .siteName(site)
                .build();

        Schedule saved = scheduleRepository.save(schedule);

        return ScheduleResponse.builder()
                .scheduleId(saved.getId())
                .title(saved.getTitle())
                .content(saved.getContent())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .siteId(site.getId())
                .siteName(site.getSiteName())
                .build();
    }

    // 일정 수정
    @Transactional
    public ScheduleResponse updateSchedule(
            Long companyId,
            Long scheduleId,
            ScheduleRequest request
    ) {

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 일정입니다."));

        Site site = siteRepository.findById(request.getSiteId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 현장입니다."));

        schedule.setTitle(request.getTitle());
        schedule.setContent(request.getContent());
        schedule.setStartDate(request.getStartDate());
        schedule.setEndDate(request.getEndDate());
        schedule.setSiteName(site);

        Schedule updated = scheduleRepository.save(schedule);

        return ScheduleResponse.builder()
                .scheduleId(updated.getId())
                .title(updated.getTitle())
                .content(updated.getContent())
                .startDate(updated.getStartDate())
                .endDate(updated.getEndDate())
                .siteId(site.getId())
                .siteName(site.getSiteName())
                .build();
    }

    // 일정 삭제
    @Transactional
    public void deleteSchedule(Long companyId, Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 일정입니다."));

        if (!schedule.getCompanyId().equals(companyId)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        scheduleRepository.delete(schedule);
    }

    // 변환 메서드
    private CalendarEventResponse toConstructionEvent(Schedule s) {
        return CalendarEventResponse.builder()
                .eventId(s.getId())
                .title(s.getTitle())
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .eventType("SITES")
                .status(deriveConstructionStatus(s.getSiteName(), s.getStartDate(), s.getEndDate()))
                .site(s.getSiteName().getSiteName())
                .build();
    }

    // 상태 도출
    private String deriveConstructionStatus(Site site, LocalDate start, LocalDate end) {
        if (site.getStatus() != null && !site.getStatus().isBlank()) {
            return site.getStatus();
        }
        LocalDate today = LocalDate.now();
        if (end.isBefore(today))  return "COMPLETED";
        if (start.isAfter(today)) return "SCHEDULED";
        return "IN_PROGRESS";
    }

    private boolean matchesStatus(CalendarEventResponse e, String status) {
        if (status == null || status.equals("ALL")) return true;
        return e.getStatus().equals(status);
    }
}