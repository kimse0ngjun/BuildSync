package com.buildsync.dto.analysis;

import java.math.BigDecimal;

public interface MonthlySalesProjection {

    String getMonth();

    BigDecimal getTotalSales();
}