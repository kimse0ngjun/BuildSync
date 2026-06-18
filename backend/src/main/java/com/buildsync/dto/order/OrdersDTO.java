package com.buildsync.dto.order;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class OrdersDTO {


	private Long orderId;
	
	private Long contactId;
	
	private Long companyId;
	
	private Date orderDate;
	
	private Date expectedDeliveryDate;
	
	private int totalAmount;
	
	private String status;
	
	private String memo;
}
