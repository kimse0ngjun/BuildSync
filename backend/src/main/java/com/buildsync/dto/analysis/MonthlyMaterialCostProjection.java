package com.buildsync.dto.analysis;

public interface MonthlyMaterialCostProjection {

	String getMonth();
	
	Integer getInboundQuantity();
	
	Integer getTotalOrderAmount();
	
	Integer getTotalMaterialCost();
}
