package com.buildsync.dto.analysis;

public interface SiteMaterialUsageAnalysisProjection {

    Long getSiteId();

    String getSiteName();

    String getMaterialName();

    Integer getInboundQuantity();

    Integer getOutboundQuantity();

    Integer getCurrentStock();

    Integer getUnitPrice();
    
    String getUnit();
}