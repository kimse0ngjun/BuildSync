package com.buildsync.dto.analysis;

import java.math.BigDecimal;

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