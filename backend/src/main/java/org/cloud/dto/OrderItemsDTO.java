package org.cloud.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemsDTO {


	@JsonProperty("order_item_id")
	private Long orderItemId;
	
	@JsonProperty("order_id")
	private Long orderId;
	
	@JsonProperty("material_id")
	private Long materialId;
	
	@JsonProperty("unit_price")
	private int unit_price;
	
	@JsonProperty("amount")
	private int amount;
	
	@JsonProperty("quantity")
	private int quantity;
}
