package com.buildsync.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockShortageResponse {

	private long criticalCount;
	private long warningCount;
	private long onOrderCount;
	private long estimatedRequiredCost;
}
