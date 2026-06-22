package com.buildsync.dto.order;

import java.util.List;

import lombok.Data;

@Data
public class OrderRequest {

	private Long companyId;

    private Long siteId;

    private Long contactId;

    private String memo;
    
    private String orderManagerName;

    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long materialId;
        private Integer quantity;
        private Integer unitPrice;
    }
}
