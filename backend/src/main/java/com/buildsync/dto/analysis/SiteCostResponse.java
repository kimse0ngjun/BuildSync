package com.buildsync.dto.analysis;

import java.math.BigDecimal;


public interface SiteCostResponse {
    Long getSiteId();
    String getSiteName();
    BigDecimal getTotalCost();
}
