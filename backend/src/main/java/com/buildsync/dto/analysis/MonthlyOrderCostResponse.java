package com.buildsync.dto.analysis;

import java.math.BigDecimal;


public interface MonthlyOrderCostResponse {
    String getMonth();
    BigDecimal getTotalCost();
}
