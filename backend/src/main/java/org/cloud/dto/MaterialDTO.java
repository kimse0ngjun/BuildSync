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
public class MaterialDTO {

	@JsonProperty("material_id")
	private Long materialId;
	
	@JsonProperty("material_code")
	private String materialCode;
	
	@JsonProperty("material_name")
	private String materialName;
	
	@JsonProperty("material_category")
	private String materialCategory;
	
	@JsonProperty("current_stock")
	private int currentStock;
	
	@JsonProperty("minimum_stock")
	private int minimumStock;
	
	@JsonProperty("unit")
	private String unit;
	
	@JsonProperty("specification")
	private String specification;
	
	@JsonProperty("price")
	private int price;
}
