package org.cloud.dto;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class OrdersDTO {


	@JsonProperty("order_id")
	private Long orderId;
	

	@JsonProperty("contact_id")
	private Long contactId;
	

	@JsonProperty("company_id")
	private Long companyId;
	

	@JsonProperty("order_date")
	private Date orderDate;
	

	@JsonProperty("expected_delivery_date")
	private Date expectedDeliveryDate;
	

	@JsonProperty("total_amount")
	private int totalAmount;
	

	@JsonProperty("status")
	private String status;
	

	@JsonProperty("memo")
	private String memo;
}
