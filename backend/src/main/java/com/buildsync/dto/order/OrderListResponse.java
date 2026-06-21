package com.buildsync.dto.order;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderListResponse {

	private Long orderId;

    private String partnerName; // 거래처 (공급업체 or 건설업체)
    private String partnerType;  // SUPPLIER / CONSTRUCTION

    private String managerName;  // 우리 회사 담당자

    private String status;

    private String orderDate;

    private String memo;

    // 품목 표시용 (대표 1개 + 외 n건 처리)
    private String mainItemName;
    private Integer extraItemCount;
}
