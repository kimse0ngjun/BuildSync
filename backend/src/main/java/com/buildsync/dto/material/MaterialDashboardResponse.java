package com.buildsync.dto.material;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MaterialDashboardResponse {

    private long totalMaterialCount;
    private long normalStockCount;
    private long shortageStockCount;
    private long incomingCount;

    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;

    private List<MaterialResponse> materials;
}