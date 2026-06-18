package com.buildsync.dto.order;

import java.util.List;

import lombok.Data;

@Data
public class OrderRequest {

	private OrdersDTO orders;
	private List<OrderItemsDTO> orderItems;
}
