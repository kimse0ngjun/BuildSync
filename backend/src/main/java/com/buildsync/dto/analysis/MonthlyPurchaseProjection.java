package com.buildsync.dto.analysis;

import java.math.BigDecimal;

public interface MonthlyPurchaseProjection {
	
	String getMonth();
	
	BigDecimal getTotalCost();
}
