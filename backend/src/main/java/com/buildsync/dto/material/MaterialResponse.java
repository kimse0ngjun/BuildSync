package com.buildsync.dto.material;

import com.buildsync.entity.Material;
import com.buildsync.entity.SupStock;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MaterialResponse {

    private Long id;
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

    public static MaterialResponse from(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .materialCode(material.getMaterialCode())
                .materialName(material.getMaterialName())
                .materialCategory(material.getMaterialCategory())
                .unit(material.getUnit())
                .specification(material.getSpecification())
                .createdAt(material.getCreatedAt())
                .build();
    }

    public static MaterialResponse from(Material material, SupStock stock) {
        return MaterialResponse.builder()
                .id(material.getId())
                .materialCode(material.getMaterialCode())
                .materialName(material.getMaterialName())
                .materialCategory(material.getMaterialCategory())
                .currentQuantity(stock.getCurrentQuantity())
                .minimumQuantity(stock.getMinimumQuantity())
                .unit(material.getUnit())
                .unitPrice(stock.getUnitPrice())
                .status(getStatus(stock))
                .supplierName(stock.getCompany().getCompanyName())
                .specification(material.getSpecification())
                .createdAt(material.getCreatedAt())
                .build();
    }

    private static String getStatus(SupStock stock) {
        if (stock.getCurrentQuantity() == null || stock.getMinimumQuantity() == null) {
            return "정상";
        }

        return stock.getCurrentQuantity() < stock.getMinimumQuantity()
                ? "부족"
                : "정상";
    }
}