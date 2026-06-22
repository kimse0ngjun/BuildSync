package com.buildsync.dto.analysis;

public interface MonthlyMaterialCostProjection {

	String getMonth();
	
	Integer getTotalOrderAmount();
	
	Integer getTotalMaterialCost();
}
