package com.buildsync.dto.order;

import java.time.LocalDate;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderDetailResponse {

	private Long orderId;
	private String orderManagerName;

    private Long siteId;
    private String siteName;

    private Long contactId;
    private String contactName;
    private String contactPhone;
    private String contactEmail;

    private Long companyId;
    private String companyName;

    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;

    private String status;

    private Integer totalAmount;

    private String memo;

    private List<OrderItemDto> items;

    @Data
    @Builder
    public static class OrderItemDto {
        private Long materialId;
        private String materialName;
        private Integer quantity;
        private Integer unitPrice;
        private Integer amount;
        private String unit;
        private String specification;
    }
}
