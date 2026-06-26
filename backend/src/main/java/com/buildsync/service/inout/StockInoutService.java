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

	    long totalCount = totalFilteredRows;
	    long countIn = filteredTotalList.stream().filter(s -> "입고".equals(s.getType())).count();
	    long countOut = filteredTotalList.stream().filter(s -> "출고".equals(s.getType())).count();
	    long countToday = filteredTotalList.stream()
	            .filter(s -> s.getProcessedDate() != null && s.getProcessedDate().toLocalDate().isEqual(LocalDate.now()))
	            .count();

	    long totalInQty = filteredTotalList.stream()
	            .filter(s -> "입고".equals(s.getType()))
	            .mapToLong(StockInout::getQuantity)
	            .sum();

	    long totalOutQty = filteredTotalList.stream()
	            .filter(s -> "출고".equals(s.getType()))
	            .mapToLong(StockInout::getQuantity)
	            .sum();

	    long netInOutQty = totalInQty - totalOutQty;

	    List<StockInout> slicedList;
	    try {
	        slicedList = PagingUtil.getSlicedList(filteredTotalList, pageable);
	        if (slicedList == null || slicedList.isEmpty()) {
	            slicedList = filteredTotalList;
	        }
	    } catch (Exception e) {
	        slicedList = filteredTotalList;
	    }

	    // 그룹핑
	    Map<String, List<StockInout>> groupedMap =
	            slicedList.stream()
	                    .collect(Collectors.groupingBy(
	                    		si -> String.valueOf(si.getId())
	                    ));

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

	    Contact contact;
	    if (req.getContactId() != null) {
	        contact = contactRepository.findById(req.getContactId()).orElse(null);
	    } else {
	        contact = contactRepository.findDefaultContactByCompanyId(req.getCompanyId());
	    }

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
	public void updateInoutStock(Long stockInoutId, InOutRegRequest req) {

	    if (req.getItems() == null || req.getItems().isEmpty()) {
	        throw new IllegalArgumentException("수정할 자재가 없습니다.");
	    }

	    Long companyId = req.getCompanyId();

	    Site site = req.getSiteId() != null
	            ? siteRepository.findById(req.getSiteId()).orElse(null)
	            : null;

	    Orders orders = req.getOrderId() != null
	            ? orderRepository.findById(req.getOrderId()).orElse(null)
	            : null;

	    Contact contact = req.getContactId() != null
	            ? contactRepository.findById(req.getContactId()).orElse(null)
	            : null;

	    StockInout oldInout = stockInoutRepository.findById(stockInoutId)
	            .orElseThrow(() ->
	                    new IllegalArgumentException("존재하지 않는 입출고 내역입니다."));

	    SupStock oldStock = supStockRepository
	            .findByCompanyIdAndMaterialId(
	                    companyId,
	                    oldInout.getMaterial().getId())
	            .orElseThrow(() ->
	                    new IllegalArgumentException("기존 자재의 정보를 찾을 수 없습니다."));

	    int rollbackQty = oldStock.getCurrentQuantity();

	    if ("입고".equals(oldInout.getType())) {
	        rollbackQty -= oldInout.getQuantity();
	    } else if ("출고".equals(oldInout.getType())) {
	        rollbackQty += oldInout.getQuantity();
	    }

	    oldStock.changeCurStock(rollbackQty);

	    stockInoutRepository.delete(oldInout);
	    stockInoutRepository.flush();

	    InOutRegRequest.ItemDetail item = req.getItems().get(0);

	    Material material = materialRepository.findById(item.getMaterialId())
	            .orElseThrow(() ->
	                    new IllegalArgumentException("존재하지 않는 자재입니다."));

	    SupStock newStock = supStockRepository
	            .findByCompanyIdAndMaterialId(companyId, material.getId())
	            .orElseThrow(() ->
	                    new IllegalArgumentException("해당 회사가 취급하지 않는 자재입니다."));

	    int updatedQty = newStock.getCurrentQuantity();

	    if ("입고".equals(req.getType())) {

	        updatedQty += item.getQuantity();

	    } else if ("출고".equals(req.getType())) {

	        updatedQty -= item.getQuantity();

	        if (updatedQty < 0) {
	            throw new IllegalStateException(
	                    material.getMaterialName()
	                            + "의 재고가 부족합니다."
	                            + "\n현재 재고("
	                            + newStock.getCurrentQuantity()
	                            + material.getUnit()
	                            + ")");
	        }
	    } else {
	        throw new IllegalArgumentException("입출고 타입이 올바르지 않습니다.");
	    }

	    newStock.changeCurStock(updatedQty);

	    StockInout newInout = StockInout.builder()
	            .site(site)
	            .material(material)
	            .orders(orders)
	            .contact(contact)
	            .type(req.getType())
	            .quantity(item.getQuantity())
	            .processedDate(java.sql.Date.valueOf(LocalDate.now()))
	            .memo(req.getMemo())
	            .build();

	    stockInoutRepository.save(newInout);
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
	public List<SelectResponse> getOrders(Long companyId) {
	    return orderRepository.findAllForSelect(companyId);
	}
	
	@Transactional(readOnly = true)
	public InOutResponse getInoutDetailById(Long stockInoutId) {

	    StockInout baseInout = stockInoutRepository.findById(stockInoutId)
	            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 입출고 이력 전표입니다."));

	    List<InOutResponse.ItemInfo> itemInfos = List.of(
	            InOutResponse.ItemInfo.builder()
	                    .materialId(baseInout.getMaterial().getId())
	                    .materialName(baseInout.getMaterial().getMaterialName())
	                    .quantity(baseInout.getQuantity())
	                    .unit(baseInout.getMaterial().getUnit())
	                    .build()
	    );

	    return InOutResponse.builder()
	            .stockInoutId(baseInout.getId())
	            .siteId(baseInout.getSite() != null ? baseInout.getSite().getId() : null)
	            .siteName(baseInout.getSite() != null ? baseInout.getSite().getSiteName() : "본사재고")
	            .orderId(baseInout.getOrders() != null ? baseInout.getOrders().getOrderId() : null)
	            .contactId(baseInout.getContact() != null ? baseInout.getContact().getContactId() : null)
	            .contactName(baseInout.getContact() != null ? baseInout.getContact().getContactName() : "-")
	            .type(baseInout.getType())
	            .processedDate(baseInout.getProcessedDate() != null
	                    ? baseInout.getProcessedDate().toString()
	                    : null)
	            .memo(baseInout.getMemo())
	            .items(itemInfos)
	            .build();
	}

}
