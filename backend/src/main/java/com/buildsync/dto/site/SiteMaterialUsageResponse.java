package com.buildsync.dto.site;

import com.buildsync.entity.StockInout;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SiteMaterialUsageResponse {

    private Long stockInoutId;

    private Long siteId;
    private String siteName;

    private Long materialId;
    private String materialCode;
    private String materialName;
    private String materialCategory;
    private String unit;

    private Integer quantity;

    private Long contactId;
    private String contactName;

    private String processedDate;
    private String memo;

    public static SiteMaterialUsageResponse from(StockInout stockInout) {
        return SiteMaterialUsageResponse.builder()
                .stockInoutId(stockInout.getId())

                .siteId(stockInout.getSite() != null ? stockInout.getSite().getId() : null)
                .siteName(stockInout.getSite() != null ? stockInout.getSite().getSiteName() : null)

                .materialId(stockInout.getMaterial() != null ? stockInout.getMaterial().getId() : null)
                .materialCode(stockInout.getMaterial() != null ? stockInout.getMaterial().getMaterialCode() : null)
                .materialName(stockInout.getMaterial() != null ? stockInout.getMaterial().getMaterialName() : null)
                .materialCategory(stockInout.getMaterial() != null ? stockInout.getMaterial().getMaterialCategory() : null)
                .unit(stockInout.getMaterial() != null ? stockInout.getMaterial().getUnit() : null)

                .quantity(stockInout.getQuantity())

                .contactId(stockInout.getContact() != null ? stockInout.getContact().getContactId() : null)
                .contactName(stockInout.getContact() != null ? stockInout.getContact().getContactName() : null)

                .processedDate(stockInout.getProcessedDate() != null ? stockInout.getProcessedDate().toString() : null)
                .memo(stockInout.getMemo())
                .build();
    }
}