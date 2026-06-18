package com.buildsync.controller.notification;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.notification.NotificationResponse;
import com.buildsync.dto.paging.PageResponse;
import com.buildsync.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {
	
	private final NotificationService notificationService;

	// 모든 알림 최신순 조회
	@GetMapping("/list")
	public ResponseEntity<PageResponse<NotificationResponse>> getAllNotification(
			@RequestParam("companyId") Long companyId,
			@PageableDefault(page = 0, size = 10) Pageable pageable) {
		
		PageResponse<NotificationResponse> list = notificationService.getAllNotification(companyId, pageable);
		return ResponseEntity.ok(list);
	}
	
	// 안 읽은 알림 최신순 조회
	@GetMapping("/not-read-list")
	public ResponseEntity<PageResponse<NotificationResponse>> getNotReadNotificationList(
			@RequestParam("companyId") Long companyId,
			@PageableDefault(page = 0, size = 10) Pageable pageable) {
		PageResponse<NotificationResponse> list = notificationService.getUnreadNotification(companyId, pageable);
		return ResponseEntity.ok(list);
	}
	
	// 단건 알림 읽음 처리
	@PatchMapping("/read/{id}")
	public ResponseEntity<String> readNotification(@PathVariable("id") Long id) {
		notificationService.readNotification(id);
		return ResponseEntity.ok("알림이 읽음 처리되었습니다.");
	}
	
	// 모든 알림 읽음 처리
	@PatchMapping("/read-all")
	public ResponseEntity<String> readAllNotification(@RequestParam("companyId") Long companyId) {
		notificationService.readAllNotification(companyId);
		return ResponseEntity.ok("모든 알림이 읽음 처리되었습니다.");
	}
}
