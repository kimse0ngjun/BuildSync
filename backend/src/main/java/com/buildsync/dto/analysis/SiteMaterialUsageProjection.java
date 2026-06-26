package com.buildsync.dto.analysis;

import java.math.BigDecimal;

public interface SiteMaterialUsageProjection {

    String getSiteName();

    BigDecimal getTotalQuantity();
}