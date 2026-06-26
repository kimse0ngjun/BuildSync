package com.buildsync.dto.inout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockInfoResponse {

    private List<MaterialStockDetail> materials;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaterialStockDetail {
        private Long materialId;
        private String materialName; 
        private String materialCode; 
        private String unit;
        private Integer currentQuantity;
        private Integer minimumQuantity;
        private Integer unitPrice;
    }
}