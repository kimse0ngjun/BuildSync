package com.buildsync.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemsDTO {

	private Long orderItemId;
	
	private Long orderId;
	
	private Long materialId;
	
	private int unitPrice;
	
	private int amount;
	
	private int quantity;
}
