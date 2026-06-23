package com.buildsync.service.schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.paging.PageResponse;
import com.buildsync.dto.schedule.CalendarEventResponse;
import com.buildsync.dto.schedule.ScheduleRequest;
import com.buildsync.dto.schedule.ScheduleResponse;
import com.buildsync.entity.Orders;
import com.buildsync.entity.Schedule;
import com.buildsync.entity.Site;
import com.buildsync.entity.StockInout;
import com.buildsync.repository.inout.StockInoutRepository;
import com.buildsync.repository.order.OrderRepository;
import com.buildsync.repository.schedule.ScheduleRepository;
import com.buildsync.repository.site.SiteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final SiteRepository siteRepository;
    private final OrderRepository orderRepository;
    private final StockInoutRepository stockInoutRepository;

    // 캘린더 조회
    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getCalendarEvents(
            Long companyId, int year, int month, String type, String status) {

        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay  = firstDay.withDayOfMonth(firstDay.lengthOfMonth());

        boolean isAll = type == null || "ALL".equals(type);
        boolean isSites = isAll || "SITES".equals(type);
        boolean isMaterial = isAll || "MATERIAL".equals(type);

        List<CalendarEventResponse> events = new ArrayList<>();

        // 공사 일정
        if (isSites) {
            scheduleRepository
                    .findByCompanyIdAndMonth(companyId, firstDay, lastDay)
                    .stream()
                    .map(this::toConstructionEvent)
                    .filter(e -> matchesStatus(e, status))
                    .forEach(events::add);
        }

        // 자재 입고 (orders)
        if (isMaterial) {
            orderRepository
            .findDeliveriesByCompanyAndMonth(
                companyId,
                firstDay,
                lastDay
            )
            .stream()
            .map(this::toDeliveryEvent)
            .filter(e -> matchesStatus(e, status))
            .forEach(events::add);


        // 실제 입출고
        stockInoutRepository
            .findCalendarInout(
                companyId,
                firstDay,
                lastDay
            )
            .stream()
            .map(this::toMaterialEvent)
            .filter(e -> matchesStatus(e, status))
            .forEach(events::add);
    }

        events.sort(Comparator.comparing(CalendarEventResponse::getStartDate));
        return events;
    }
    
    // 일정 게시판 조회
    @Transactional(readOnly = true)
    public PageResponse<ScheduleResponse> getScheduleList(
            Long companyId,
            Pageable pageable
    ) {

        Page<ScheduleResponse> page =
                scheduleRepository
                        .findByCompanyId(companyId, pageable)
                        .map(schedule -> ScheduleResponse.builder()
                                .scheduleId(schedule.getId())
                                .title(schedule.getTitle())
                                .content(schedule.getContent())
                                .startDate(schedule.getStartDate())
                                .endDate(schedule.getEndDate())
                                .siteId(schedule.getSiteName().getId())
                                .siteName(schedule.getSiteName().getSiteName())
                                .build()
                        );


        return new PageResponse<>(
                page.getContent(),
                pageable,
                page.getTotalElements()
        );
    }
    
    // 상세 정보
    @Transactional(readOnly = true)
    public ScheduleResponse getSchedule(
            Long companyId,
            Long scheduleId
    ) {

        Schedule schedule =
            scheduleRepository.findByIdAndCompanyId(
                scheduleId,
                companyId
            )
            .orElseThrow(
                () -> new RuntimeException("존재하지 않는 일정입니다.")
            );

        return ScheduleResponse.builder()
                .scheduleId(schedule.getId())
                .title(schedule.getTitle())
                .content(schedule.getContent())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .siteId(schedule.getSiteName().getId())
                .siteName(
                    schedule.getSiteName().getSiteName()
                )
                .build();
    }

    // 일정 생성
    @Transactional
    public ScheduleResponse createSchedule(Long companyId, ScheduleRequest request) {

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
    public ScheduleResponse updateSchedule(Long companyId, Long scheduleId, ScheduleRequest request) {

    	Schedule schedule = scheduleRepository.findByIdAndCompanyId(
    	        scheduleId,
    	        companyId
    	)
    	.orElseThrow(() -> 
    	        new IllegalArgumentException("존재하지 않는 일정입니다.")
    	);

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

    // 삭제
    @Transactional
    public void deleteSchedule(
            Long companyId,
            Long scheduleId,
            String type
    ) {

        switch (type.toUpperCase()) {

            case "SITES" -> {

                Schedule schedule = scheduleRepository.findById(scheduleId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("일정을 찾을 수 없습니다."));

                if (!schedule.getCompanyId().equals(companyId)) {
                    throw new IllegalArgumentException("삭제 권한이 없습니다.");
                }

                scheduleRepository.delete(schedule);
            }

            case "MATERIALS" -> {

                Orders order = orderRepository.findById(scheduleId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("발주 정보를 찾을 수 없습니다."));

                if (!order.getCompany().getId().equals(companyId)) {
                    throw new IllegalArgumentException("삭제 권한이 없습니다.");
                }

                orderRepository.delete(order);
            }

            default -> throw new IllegalArgumentException("지원하지 않는 일정 타입입니다.");
        }
    }

    // 공사 일정 상태
    private CalendarEventResponse toConstructionEvent(Schedule s) {
        return CalendarEventResponse.builder()
                .eventId(s.getId())
                .title(s.getTitle())
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .eventType("SITES")
                .status(
                        deriveConstructionStatus(
                                s.getSiteName(),
                                s.getStartDate(),
                                s.getEndDate()
                        )
                )
                .siteId(s.getSiteName().getId())
                .siteName(s.getSiteName().getSiteName())
                .supplierId(null)
                .supplierName(null)
                .build();
    }

    // 자재 입출고 일정 상태 
    private CalendarEventResponse toMaterialEvent(StockInout s) {

        return CalendarEventResponse.builder()
                .eventId(s.getId())

                .title(
                    "IN".equals(s.getType())
                    ? "자재 입고"
                    : "자재 출고"
                )

                .startDate(
                	    s.getProcessedDate().toLocalDate()
                	)
                	.endDate(
                	    s.getProcessedDate().toLocalDate()
                	)

                .eventType("MATERIAL")

                .materialType(s.getType())

                .status("END")

                .siteId(
                    s.getSite() != null
                    ? s.getSite().getId()
                    : null
                )

                .siteName(
                    s.getSite() != null
                    ? s.getSite().getSiteName()
                    : null
                )
                .build();
    }
    
    // 입고 예정 일정
    private CalendarEventResponse toDeliveryEvent(Orders o) {

        boolean isOut =
                o.getMemo() != null &&
                o.getMemo().contains("출고");

        return CalendarEventResponse.builder()
                .eventId(o.getOrderId())

                .title(
                    isOut
                    ? "자재 출고 예정"
                    : "자재 입고 예정"
                )

                .startDate(
                    o.getOrderDate().toLocalDate()
                )

                .endDate(
                    o.getExpectedDeliveryDate().toLocalDate()
                )

                .eventType("MATERIAL")

                .materialType(
                    isOut ? "OUT" : "IN"
                )

                .status(
                    o.getStatus().name()
                )

                .siteId(
                    o.getSite() != null
                    ? o.getSite().getId()
                    : null
                )

                .siteName(
                    o.getSite() != null
                    ? o.getSite().getSiteName()
                    : null
                )

                .supplierId(
                    o.getCompany().getId()
                )

                .supplierName(
                    o.getCompany().getCompanyName()
                )

                .build();
    }

    // 공사 상태 계산
    private String deriveConstructionStatus(Site site, LocalDate start, LocalDate end) {

        if (site.getStatus() != null && !site.getStatus().isBlank()) {
            return site.getStatus();
        }

        LocalDate today = LocalDate.now();

        if (end.isBefore(today)) return "END";
        if (start.isAfter(today)) return "PENDING";

        return "ACCEPTED";
    }

    // 상태 필터
    private boolean matchesStatus(CalendarEventResponse e, String status) {
        if (status == null || status.equals("ALL")) return true;
        if (e.getStatus() == null) return false;
        return e.getStatus().equals(status);
    }
}