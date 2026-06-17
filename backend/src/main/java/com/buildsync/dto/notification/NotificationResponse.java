package com.buildsync.dto.notification;

import java.text.SimpleDateFormat;

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
		this.noticeId = noticeId;
		this.type = type;
		this.title = title;
		this.content = content;
		this.relatedId = relatedId;
		this.isRead = isRead;
		
		if (notification.getCreatedAt() != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			this.createdAt = sdf.format(notification.getCreatedAt());
		}
	}
}
