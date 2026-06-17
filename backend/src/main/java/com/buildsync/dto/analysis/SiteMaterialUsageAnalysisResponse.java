package com.buildsync.dto.analysis;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SiteMaterialUsageAnalysisResponse {

	private Long siteId;
	private String siteName;
	private String materialName;
	private String unit;
	private Integer inboundQuantity;
	private Integer outboundQuantity;
	private Integer currentStock;
	private Integer unitPrice;
}
