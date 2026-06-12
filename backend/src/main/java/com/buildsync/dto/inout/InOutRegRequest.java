package com.buildsync.dto.inout;

import java.util.List;

import com.buildsync.entity.OrderItems;

import lombok.Data;

@Data
public class InOutRegRequest {

	private Long siteId;
	private Long orderId;
	private Long contactId;
	private String type;
	private String memo;
	
	private List<ItemDetail> items;
	
	@Data
	public static class ItemDetail {
		private Long materialId;
		private Integer quantity;
	}
}
