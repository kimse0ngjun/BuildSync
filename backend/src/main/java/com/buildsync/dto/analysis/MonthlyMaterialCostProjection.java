package com.buildsync.dto.analysis;

public interface MonthlyMaterialCostProjection {

    String getMonth();

    Integer getTotalQuantity();

    Integer getTotalMaterialCost();

}