package com.buildsync.service.inout;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.inout.InOutRegRequest;
import com.buildsync.dto.inout.InOutResponse;
import com.buildsync.dto.inout.InOutSumResponse;
import com.buildsync.dto.inout.SelectResponse;
import com.buildsync.dto.inout.StockInfoResponse;
import com.buildsync.dto.paging.PageResponse;
import com.buildsync.entity.Contact;
import com.buildsync.entity.Material;
import com.buildsync.entity.Orders;
import com.buildsync.entity.Site;
import com.buildsync.entity.StockInout;
import com.buildsync.entity.SupStock;
import com.buildsync.paging.PagingUtil;
import com.buildsync.repository.company.ContactRepository;
import com.buildsync.repository.inout.StockInoutRepository;
import com.buildsync.repository.material.MaterialRepository;
import com.buildsync.repository.material.SupStockRepository;
import com.buildsync.repository.order.OrderRepository;
import com.buildsync.repository.site.SiteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockInoutService {

	private final StockInoutRepository stockInoutRepository;
	private final OrderRepository orderRepository;
	private final SiteRepository siteRepository;
	private final ContactRepository contactRepository;
	private final MaterialRepository materialRepository;
	private final SupStockRepository supStockRepository;
	
	@Transactional(readOnly = true)
	public InOutSumResponse getInoutDashboardData(
	        Long companyId,
	        String type,
	        Long materialId,
	        Long siteId,
	        Long orderId,
	        LocalDate startDate,
	        LocalDate endDate,
	        String keyword,
	        Pageable pageable) {

	    String searchKeyword =
	            (keyword != null && !keyword.trim().isEmpty())
	                    ? keyword.trim()
	                    : null;

	    // 상단 통계
	    long totalCount = stockInoutRepository.totalCountInout(companyId);
	    long countIn = stockInoutRepository.countInout(companyId, "입고");
	    long countOut = stockInoutRepository.countInout(companyId, "출고");
	    long countToday = stockInoutRepository.countInoutToday(companyId);

	    // 필터 조회
	    List<StockInout> filteredTotalList =
	            stockInoutRepository.inoutListByFilters(
	                    companyId,
	                    type,
	                    materialId,
	                    siteId,
	                    orderId,
	                    startDate,
	                    endDate,
	                    searchKeyword);
	    
	    // 순수 총 처리 건수
	    long totalFilteredRows = filteredTotalList.size();

	    // 수량 통계
	    long totalInQty =
	            stockInoutRepository.calculQtyByFilters(
	                    companyId,
	                    "입고",
	                    materialId,
	                    siteId,
	                    orderId,
	                    startDate,
	                    endDate,
	                    searchKeyword);

	    long totalOutQty =
	            stockInoutRepository.calculQtyByFilters(
	                    companyId,
	                    "출고",
	                    materialId,
	                    siteId,
	                    orderId,
	                    startDate,
	                    endDate,
	                    searchKeyword);

	    long netInOutQty = totalInQty - totalOutQty;

	    // 페이징 대상
	    List<StockInout> slicedList =
	            PagingUtil.getSlicedList(filteredTotalList, pageable);

	    // 그룹핑
	    Map<String, List<StockInout>> groupedMap =
	            slicedList.stream()
	                    .collect(Collectors.groupingBy(si -> {

	                        if (si.getOrders() != null) {
	                            return "ORDER_" + si.getOrders().getOrderId();
	                        }

	                        Long siteKey =
	                                si.getSite() != null
	                                        ? si.getSite().getId()
	                                        : 0L;

	                        Long contactKey =
	                                si.getContact() != null
	                                        ? si.getContact().getContactId()
	                                        : 0L;

	                        return String.valueOf(si.getProcessedDate())
	                                + "_"
	                                + siteKey
	                                + "_"
	                                + contactKey
	                                + "_"
	                                + si.getType();
	                    }));

	    // DTO 변환
	    List<InOutResponse> dtoList =
	            groupedMap.values().stream()
	                    .map(group -> {

	                        StockInout base = group.get(0);

	                        List<InOutResponse.ItemInfo> itemInfos =
	                                group.stream()
	                                        .map(item -> InOutResponse.ItemInfo.builder()
	                                                .materialId(item.getMaterial().getId())
	                                                .materialName(item.getMaterial().getMaterialName())
	                                                .quantity(item.getQuantity())
	                                                .unit(item.getMaterial().getUnit())
	                                                .build())
	                                        .collect(Collectors.toList());

	                        return InOutResponse.builder()
	                                .stockInoutId(base.getId())
	                                .siteId(base.getSite() != null
	                                        ? base.getSite().getId()
	                                        : null)
	                                .siteName(base.getSite() != null
	                                        ? base.getSite().getSiteName()
	                                        : "본사재고")
	                                .orderId(base.getOrders() != null
	                                        ? base.getOrders().getOrderId()
	                                        : null)
	                                .contactId(base.getContact() != null
	                                        ? base.getContact().getContactId()
	                                        : null)
	                                .contactName(base.getContact() != null
	                                        ? base.getContact().getContactName()
	                                        : "-")
	                                .type(base.getType())
	                                .processedDate(base.getProcessedDate() != null
	                                        ? base.getProcessedDate().toString()
	                                        : null)
	                                .memo(base.getMemo())
	                                .items(itemInfos)
	                                .build();
	                    })
	                    .collect(Collectors.toList());

	    // 전체 건수(그룹 기준)
	    long totalProcessedCount =
	            filteredTotalList.stream()
	                    .map(si -> {

	                        if (si.getOrders() != null) {
	                            return "ORDER_" + si.getOrders().getOrderId();
	                        }

	                        Long siteKey =
	                                si.getSite() != null
	                                        ? si.getSite().getId()
	                                        : 0L;

	                        Long contactKey =
	                                si.getContact() != null
	                                        ? si.getContact().getContactId()
	                                        : 0L;

	                        return String.valueOf(si.getProcessedDate())
	                                + "_"
	                                + siteKey
	                                + "_"
	                                + contactKey
	                                + "_"
	                                + si.getType();
	                    })
	                    .distinct()
	                    .count();

	    PageResponse<InOutResponse> pagingData =
	            new PageResponse<>(
	                    dtoList,
	                    pageable,
	                    totalProcessedCount);
	    
	    List<InOutSumResponse.ChartData> chartDataList = stockInoutRepository.getInoutChartData(
	            companyId, materialId, siteId, startDate, endDate);

	    InOutSumResponse response = new InOutSumResponse();

	    response.setTotalCount(totalCount);
	    response.setInCount(countIn);
	    response.setOutCount(countOut);
	    response.setTodayCount(countToday);

	    response.setTotalInQty(totalInQty);
	    response.setTotalOutQty(totalOutQty);
	    response.setNetInOutQty(netInOutQty);
	    
	    response.setTotalProcessedCount(totalFilteredRows);
	    response.setChartData(chartDataList);

	    response.setInOutList(pagingData);

	    return response;
	}
	
	// 출고 등록 - 발주번호 선택 시 자동 완성
	@Transactional(readOnly = true)
	public Map<String, Object> getAutoFill(Long orderId) {

	    Orders orders = orderRepository.findById(orderId)
	            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 발주서입니다."));

	    Map<String, Object> data = new HashMap<>();

	    // 현장 정보
	    if (orders.getSite() != null) {
	        data.put("siteId", orders.getSite().getId());
	        data.put("siteName", orders.getSite().getSiteName());
	    }

	    // 담당자 정보
	    if (orders.getContact() != null) {
	        data.put("contactId", orders.getContact().getContactId());
	        data.put("contactName", orders.getContact().getContactName());
	    }

	    List<Map<String, Object>> materialList = orders.getItems()
	            .stream()
	            .map(i -> {
	                Map<String, Object> m = new HashMap<>();

	                m.put("materialId", i.getMaterial().getId());
	                m.put("materialName", i.getMaterial().getMaterialName());
	                m.put("materialCode", i.getMaterial().getMaterialCode());
	                m.put("unit", i.getMaterial().getUnit());
	                m.put("quantity", i.getQuantity());
	                m.put("unitPrice", i.getUnitPrice());

	                return m;
	            })
	            .collect(Collectors.toList());

	    data.put("items", materialList);

	    return data;
	}


	// 등록 자재 선택 시 자재 정보
	@Transactional(readOnly = true)
	public StockInfoResponse getPureStockInfo(Long companyId, Long materialId) {

	    SupStock stock = supStockRepository
	            .findByCompanyIdAndMaterialId(companyId, materialId)
	            .orElseThrow(() -> new IllegalArgumentException("재고 정보가 없습니다."));

	    StockInfoResponse.MaterialStockDetail detail =
	            StockInfoResponse.MaterialStockDetail.builder()
	                    .materialId(stock.getMaterial().getId())
	                    .materialName(stock.getMaterial().getMaterialName())
	                    .materialCode(stock.getMaterial().getMaterialCode())
	                    .unit(stock.getMaterial().getUnit())
	                    .currentQuantity(stock.getCurrentQuantity())
	                    .minimumQuantity(stock.getMinimumQuantity())
	                    .unitPrice(stock.getUnitPrice())
	                    .build();

	    return StockInfoResponse.builder()
	            .materials(List.of(detail))
	            .build();
	}
	
	// 입출고 등록 + 자재 변동 처리
	@Transactional
	public void registerStockInout(InOutRegRequest req) {

	    if (req.getItems() == null || req.getItems().isEmpty()) {
	        throw new IllegalArgumentException("등록할 자재가 없습니다.");
	    }

	    Site site = req.getSiteId() != null
	            ? siteRepository.findById(req.getSiteId()).orElse(null)
	            : null;

	    Orders orders = req.getOrderId() != null
	            ? orderRepository.findById(req.getOrderId()).orElse(null)
	            : null;

	    Contact contact = req.getContactId() != null
	            ? contactRepository.findById(req.getContactId()).orElse(null)
	            : null;

	    Long companyId = req.getCompanyId();

	    for (InOutRegRequest.ItemDetail item : req.getItems()) {

	        Material material = materialRepository.findById(item.getMaterialId())
	                .orElseThrow(() -> new IllegalArgumentException("존재하지 않은 자재입니다."));

	        SupStock supStock = supStockRepository
	                .findByCompanyIdAndMaterialId(companyId, material.getId())
	                .orElseThrow(() -> new IllegalArgumentException("해당 회사가 취급하지 않는 자재입니다."));

	        int updatedStock;

	        if ("입고".equals(req.getType())) {

	            updatedStock = supStock.getCurrentQuantity() + item.getQuantity();

	        } else if ("출고".equals(req.getType())) {

	            updatedStock = supStock.getCurrentQuantity() - item.getQuantity();

	            if (updatedStock < 0) {
	                throw new IllegalStateException(
	                        material.getMaterialName() + "의 재고가 부족합니다."
	                        + "\n현재 재고 (" + supStock.getCurrentQuantity()
	                        + material.getUnit() + ")"
	                );
	            }

	        } else {
	            throw new IllegalArgumentException("입출고 타입이 올바르지 않습니다.");
	        }

	        supStock.changeCurStock(updatedStock);

	        StockInout stockInout = StockInout.builder()
	                .site(site)
	                .material(material)
	                .orders(orders)
	                .contact(contact)
	                .type(req.getType())
	                .quantity(item.getQuantity())
	                .processedDate(java.sql.Date.valueOf(LocalDate.now()))
	                .memo(req.getMemo())
	                .build();

	        stockInoutRepository.save(stockInout);
	    }
	}
	
	// 입출고 수정 + 자재 변동 처리
	@Transactional
	public void updateInoutStock(InOutRegRequest req) {

	    if (req.getItems() == null || req.getItems().isEmpty()) {
	        throw new IllegalArgumentException("수정할 자재가 없습니다.");
	    }

	    Site site = req.getSiteId() != null
	            ? siteRepository.findById(req.getSiteId()).orElse(null)
	            : null;

	    Orders orders = req.getOrderId() != null
	            ? orderRepository.findById(req.getOrderId()).orElse(null)
	            : null;

	    Contact contact = req.getContactId() != null
	            ? contactRepository.findById(req.getContactId()).orElse(null)
	            : null;

	    Long companyId = req.getCompanyId();

	    // 기존 입출고 롤백
	    if (req.getDeleteInoutIds() != null && !req.getDeleteInoutIds().isEmpty()) {

	        List<StockInout> oldInoutList =
	                stockInoutRepository.findAllById(req.getDeleteInoutIds());

	        if (oldInoutList.size() != req.getDeleteInoutIds().size()) {
	            throw new IllegalArgumentException(
	                    "수정하려는 이력 중 이미 삭제되었거나 존재하지 않는 내역이 포함되어 있습니다.");
	        }

	        for (StockInout stockInout : oldInoutList) {

	            SupStock oldStock = supStockRepository
	                    .findByCompanyIdAndMaterialId(
	                            companyId,
	                            stockInout.getMaterial().getId())
	                    .orElseThrow(() ->
	                            new IllegalArgumentException("기존 자재의 정보를 찾을 수 없습니다."));

	            int rollbackQty = oldStock.getCurrentQuantity();

	            if ("입고".equals(stockInout.getType())) {

	                rollbackQty -= stockInout.getQuantity();

	            } else if ("출고".equals(stockInout.getType())) {

	                rollbackQty += stockInout.getQuantity();

	            } else {

	                throw new IllegalArgumentException(
	                        "기존 입출고 데이터의 타입이 올바르지 않습니다.");
	            }

	            oldStock.changeCurStock(rollbackQty);
	        }

	        stockInoutRepository.deleteAll(oldInoutList);
	        stockInoutRepository.flush();
	    }

	    // 신규 입출고 등록
	    for (InOutRegRequest.ItemDetail item : req.getItems()) {

	        Material material = materialRepository.findById(item.getMaterialId())
	                .orElseThrow(() ->
	                        new IllegalArgumentException("존재하지 않은 자재입니다."));

	        SupStock newSupStock = supStockRepository
	                .findByCompanyIdAndMaterialId(companyId, material.getId())
	                .orElseThrow(() ->
	                        new IllegalArgumentException("해당 회사가 취급하지 않는 자재입니다."));

	        int updatedStock = newSupStock.getCurrentQuantity();

	        if ("입고".equals(req.getType())) {

	            updatedStock += item.getQuantity();

	        } else if ("출고".equals(req.getType())) {

	            updatedStock -= item.getQuantity();

	            if (updatedStock < 0) {
	                throw new IllegalStateException(
	                        material.getMaterialName()
	                                + "의 재고가 부족하여 수정할 수 없습니다."
	                                + "\n현재 재고 ("
	                                + newSupStock.getCurrentQuantity()
	                                + material.getUnit()
	                                + ")");
	            }

	        } else {

	            throw new IllegalArgumentException("입출고 타입이 올바르지 않습니다.");
	        }

	        newSupStock.changeCurStock(updatedStock);

	        StockInout newStockInout = StockInout.builder()
	                .site(site)
	                .material(material)
	                .orders(orders)
	                .contact(contact)
	                .type(req.getType())
	                .quantity(item.getQuantity())
	                .processedDate(java.sql.Date.valueOf(LocalDate.now()))
	                .memo(req.getMemo())
	                .build();

	        stockInoutRepository.save(newStockInout);
	    }
	}
	
	// 입출고 상세
	@Transactional(readOnly = true)
	public InOutResponse getInoutDetail(
	        Long orderId,
	        String dateStr,
	        Long siteId,
	        Long contactId,
	        String type) {

	    List<StockInout> inoutList;

	    if (orderId != null) {

	        inoutList = stockInoutRepository.findByOrderId(orderId);

	    } else {

	        DateTimeFormatter formatter =
	                DateTimeFormatter.ofPattern(
	                        "[yyyy-MM-dd][yyyy/MM/dd][yyyy.MM.dd]");

	        LocalDate localDate =
	                LocalDate.parse(dateStr, formatter);

	        java.sql.Date processedDate =
	                java.sql.Date.valueOf(localDate);

	        inoutList =
	                stockInoutRepository
	                        .findByProcessedDateAndSiteAndContactIdAndType(
	                                processedDate,
	                                siteId,
	                                contactId,
	                                type);
	    }

	    if (inoutList.isEmpty()) {
	        throw new IllegalArgumentException(
	                "해당 조건의 입출고 내역 상세 정보를 찾을 수 없습니다.");
	    }

	    StockInout si = inoutList.get(0);

	    List<InOutResponse.ItemInfo> itemInfo =
	            inoutList.stream()
	                    .map(i -> InOutResponse.ItemInfo.builder()
	                            .materialId(i.getMaterial().getId())
	                            .materialName(i.getMaterial().getMaterialName())
	                            .quantity(i.getQuantity())
	                            .unit(i.getMaterial().getUnit())
	                            .build())
	                    .collect(Collectors.toList());

	    return InOutResponse.builder()
	            .stockInoutId(si.getId())
	            .siteId(si.getSite() != null ? si.getSite().getId() : null)
	            .siteName(si.getSite() != null
	                    ? si.getSite().getSiteName()
	                    : "본사재고")
	            .orderId(si.getOrders() != null
	                    ? si.getOrders().getOrderId()
	                    : null)
	            .contactId(si.getContact() != null
	                    ? si.getContact().getContactId()
	                    : null)
	            .contactName(si.getContact() != null
	                    ? si.getContact().getContactName()
	                    : "-")
	            .type(si.getType())
	            .processedDate(
	                    si.getProcessedDate() != null
	                            ? si.getProcessedDate().toString()
	                            : null)
	            .memo(si.getMemo())
	            .items(itemInfo)
	            .build();
	}
	
	@Transactional(readOnly = true)
	public List<SelectResponse> getMaterials() {
	    return materialRepository.findAllForSelect();
	}

	@Transactional(readOnly = true)
	public List<SelectResponse> getSites() {
	    return siteRepository.findAllForSelect();
	}

	@Transactional(readOnly = true)
	public List<SelectResponse> getOrders() {
	    return orderRepository.findAllForSelect();
	}
}
