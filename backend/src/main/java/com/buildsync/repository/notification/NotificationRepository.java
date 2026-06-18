package com.buildsync.repository.notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

	// 모든 알림 조회 (최신순)
	List<Notification> findByCompany_IdOrderByIdDesc(Long companyId);
	
	// 읽지 않음만 조회
	List<Notification> findByCompany_IdAndIsReadOrderByIdDesc(Long companyId, int isRead);
	
	// 읽음 처리
	@Modifying
	@Query("UPDATE Notification n SET n.isRead = 1 WHERE n.id = :id")
	int markAsRead(@Param("id") Long id);
	
	// 모두 읽음 처리
	@Modifying
	@Query("UPDATE Notification n SET n.isRead = 1 WHERE n.company.id = :companyId AND n.isRead = 0")
	int markAllAsRead(@Param("companyId") Long companyId);
}
