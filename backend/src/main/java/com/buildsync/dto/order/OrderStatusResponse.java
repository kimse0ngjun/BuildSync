package com.buildsync.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderStatusResponse {

	private long totalCount;
	private long pendingCount;
	private long acceptedCount; // 접수 완료
	private long endCount; // 발주 완료
	private long cancelCount;
}
