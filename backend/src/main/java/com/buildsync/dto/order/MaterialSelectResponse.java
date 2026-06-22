package com.buildsync.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MaterialSelectResponse {

	private Long value;       // materialId
    private String label;     // materialName
    private String specification;
    private String unit;
    private Integer unitPrice;
}
