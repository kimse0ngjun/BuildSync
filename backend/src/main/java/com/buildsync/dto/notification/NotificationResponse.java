package com.buildsync.dto.notification;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;

import com.buildsync.entity.Notification;

import lombok.Data;

@Data
public class NotificationResponse {

	private Long noticeId;
	private String type;
	private String title;
	private String content;
	private Long relatedId;
	private int isRead;
	private String createdAt;
	
	public NotificationResponse(Notification notification) {
		this.noticeId = notification.getId();
		this.type = notification.getType();
		this.title = notification.getTitle();
		this.content = notification.getContent();
		this.relatedId = notification.getRelatedId();
		this.isRead = notification.getIsRead();
		
		if (notification.getCreatedAt() != null) {
			this.createdAt = notification.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
		}
	}
}
