package com.buildsync.dto.analysis;

public interface SiteMaterialCostProjection {

    String getSiteName();

    String getMaterialName();

    Integer getQuantity();

    Integer getUnitPrice();

    Integer getTotalPrice();
}