package com.buildsync.dto.inout;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class InOutResponse {

	private Long stockInoutId;
    private Long siteId;
    private String siteName;
    private Long orderId;
    private Long contactId;
    private String contactName;
    private String type;
    private String processedDate;
    private String memo;

    private List<ItemInfo> items;

    @Data
    @Builder
    public static class ItemInfo {
        
        private Long materialId;
        private String materialName;
        private int quantity;
        private String unit;
    }
}