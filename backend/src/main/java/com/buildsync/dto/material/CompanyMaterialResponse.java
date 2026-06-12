package com.buildsync.dto.material;

import com.buildsync.entity.SupMaterial;
import com.buildsync.entity.SupStock;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CompanyMaterialResponse {

    private Long supMaterialId;
    private Long materialId;

    private String materialCode;
    private String materialName;
    private String materialCategory;

    private Integer currentQuantity;
    private Integer minimumQuantity;

    private String unit;
    private Integer unitPrice;

    private String status;
    private String supplierName;

    private String specification;
    private LocalDateTime createdAt;

    public static CompanyMaterialResponse from(SupMaterial supMaterial, SupStock stock) {
        return CompanyMaterialResponse.builder()
                .supMaterialId(supMaterial.getId())
                .materialId(supMaterial.getMaterial().getId())
                .materialCode(supMaterial.getMaterial().getMaterialCode())
                .materialName(supMaterial.getMaterial().getMaterialName())
                .materialCategory(supMaterial.getMaterial().getMaterialCategory())
                .currentQuantity(stock.getCurrentQuantity())
                .minimumQuantity(stock.getMinimumQuantity())
                .unit(supMaterial.getMaterial().getUnit())
                .unitPrice(stock.getUnitPrice())
                .status(getStatus(stock))
                .supplierName(supMaterial.getCompany().getCompanyName())
                .specification(supMaterial.getMaterial().getSpecification())
                .createdAt(supMaterial.getMaterial().getCreatedAt())
                .build();
    }

    private static String getStatus(SupStock stock) {
        return stock.getCurrentQuantity() < stock.getMinimumQuantity()
                ? "부족"
                : "정상";
    }
}