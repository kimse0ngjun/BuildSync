package com.buildsync.dto.inout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockInfoResponse {

	private Long materialId;
    private String unit;
    private Integer currentQuantity;
    private Integer minimumQuantity;
    
    private Integer totalAmount;
    private Integer expectedQuantity;
}
