package org.cloud.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyDTO {

	@JsonProperty("company_id")
	private Long companyId;
	
	@JsonProperty("company_type")
	private String companyType;
	
	@JsonProperty("company_name")
	private String companyName;
	
	@JsonProperty("ceo_name")
	private String ceoName;
	
	@JsonProperty("business_number")
	private String businessNumber;
	
	@JsonProperty("address")
	private String address;
	
	@JsonProperty("homepage_url")
	private String homepageUrl;
	
	@JsonProperty("phone")
	private String phone;
}
