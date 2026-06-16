package com.buildsync.service.notification;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.notification.NotificationResponse;
import com.buildsync.entity.Company;
import com.buildsync.entity.Notification;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.notification.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository notificationRepository;
	private final CompanyRepository companyRepository;
	
	// 알림 발송
	@Transactional
	public void sendNotification(Long receiverId, String type, String title, String content, Long relatedId) {
		Company receiver = companyRepository.findById(receiverId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않은 수신 업체입니다."));
		
		Notification notification = new Notification();
		notification.setCompany(receiver);
		notification.setType(type);
		notification.setTitle(title);
		notification.setContent(content);
		notification.setRelatedId(relatedId);
		notification.setIsRead(0);
		
		notificationRepository.save(notification);
	}
	
	@Transactional(readOnly = true)
	public List<NotificationResponse> getAllNotification(Long companyId) {
		return notificationRepository.findByCompanyIdOrderByIdDesc(companyId)
				.stream()
				.map(NotificationResponse::new)
				.collect(Collectors.toList());
	}
	
	// 안 읽은 목록 최신순 조회
	@Transactional(readOnly = true)
	public List<NotificationResponse> getUnreadNotification(Long companyId) {
		return notificationRepository.findByCompanyIdAndIsReadOrderByIdDesc(companyId, 0)
				.stream()
				.map(NotificationResponse::new)
				.collect(Collectors.toList());
	}
	
	// 알림 읽음 처리
	@Transactional
	public void readNotification(Long id) {
		int updatedRows = notificationRepository.markAsRead(id);
		if (updatedRows == 0) {
			throw new IllegalArgumentException("존재하지 않는 알림이거나 이미 읽음 처리된 알림입니다.");
		}
	}
	
	// 알림 모두 읽음 처리
	@Transactional
	public void readAllNotification(Long companyId) {
		notificationRepository.markAllAsRead(companyId);
	}
}
