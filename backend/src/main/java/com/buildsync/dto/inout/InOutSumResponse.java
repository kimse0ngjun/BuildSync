package com.buildsync.dto.inout;

import com.buildsync.dto.paging.PageResponse;
import com.buildsync.entity.StockInout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InOutSumResponse {
	
	private long totalCount;
	private long inCount;
	private long outCount;
	private long todayCount;

	private long totalInQty;
	private long totalOutQty;
	private long netInOutQty; // 순입출고 수량
	private long totalProcessedCount;
	
	private PageResponse<StockInout> inOutList;
}
