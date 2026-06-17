package com.buildsync.dto.analysis;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonthlyMaterialCostResponse {

	private String month; // 월
	private Integer totalOrderAmount; // 발주 총 금액
	private Integer totalMaterialCost; // 총 자재 구매 비용
}
