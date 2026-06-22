package com.buildsync.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialShortageResponse {

	private Long materialId;
	private String materialName;
	private int currentStock;
	private int safetyStock; // 안전 재고
	private int deficitQuantity; // 부족한 수량
	private int unitPrice;
	private String statusMessage;
}
