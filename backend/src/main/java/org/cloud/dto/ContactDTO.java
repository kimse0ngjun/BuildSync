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
public class ContactDTO {

	@JsonProperty("contact_id")
	private Long contactId;
	
	@JsonProperty("company_id")
	private Long companyId;
	
	@JsonProperty("contact_name")
	private String contactName;
	
	@JsonProperty("department")
	private String department;
	
	@JsonProperty("position")
	private String position;
	
	@JsonProperty("phone")
	private String phone;
	
	@JsonProperty("email")
	private String email;
}
