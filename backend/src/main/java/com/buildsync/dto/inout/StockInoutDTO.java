package com.buildsync.dto.inout;

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
public class StockInoutDTO {

	private Long stockInoutId;
	private Long materialId;
	private Long siteId;
	private Long orderId;
	private Long contactId;
	private String type;
	private int quantity;
	private Date processedDate;
	private String memo;
}
