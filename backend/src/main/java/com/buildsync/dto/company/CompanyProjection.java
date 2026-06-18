package com.buildsync.dto.company;

import java.time.LocalDateTime;

public interface CompanyProjection {

    Long getCompanyId();
    String getCompanyType();
    String getCompanyName();
    String getCeoName();
    String getPhone();
    String getAddress();
    LocalDateTime getCreatedAt();
    String getMaterials();
}