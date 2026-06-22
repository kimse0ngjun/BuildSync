package com.buildsync.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderStatusResponse {

	private Long totalCount;
	private Long pendingCount;
	private Long acceptedCount; // 접수 완료
	private Long endCount; // 발주 완료
	private Long cancelCount;
}
