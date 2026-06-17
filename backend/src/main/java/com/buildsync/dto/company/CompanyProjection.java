package com.buildsync.dto.company;

import java.time.LocalDate;

import com.buildsync.entity.CompanyType;

public interface CompanyProjection {

	Long getCompanyId();
	CompanyType getCompanyType();
	String getCompanyName();
	String getCeoName();
	String getPhone();
	String getAddress();
    LocalDate getCreatedAt();
    String getMaterials();
}
