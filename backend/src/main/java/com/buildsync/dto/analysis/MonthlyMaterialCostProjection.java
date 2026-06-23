package com.buildsync.dto.analysis;

public interface MonthlyMaterialCostProjection {

	String getMonth();
	
	Long getTotalOrderAmount();
	
	Long getTotalMaterialCost();
}
