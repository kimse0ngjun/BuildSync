package com.buildsync.dto.material;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialRequest {

    private String materialCode;
    private String materialName;
    private String materialCategory;
    private String unit;
    private String specification;

    private Integer currentQuantity;
    private Integer minimumQuantity;
    private Integer unitPrice;
}