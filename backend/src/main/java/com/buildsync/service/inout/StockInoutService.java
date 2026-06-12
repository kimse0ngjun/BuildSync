package com.buildsync.service.inout;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.inout.InOutRegRequest;
import com.buildsync.dto.inout.InOutSumResponse;
import com.buildsync.entity.Contact;
import com.buildsync.entity.Material;
import com.buildsync.entity.Orders;
import com.buildsync.entity.Site;
import com.buildsync.entity.StockInout;
import com.buildsync.repository.company.ContactRepository;
import com.buildsync.repository.inout.StockInoutRepository;
import com.buildsync.repository.material.MaterialRepository;
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
	
	@Transactional(readOnly = true)
	public InOutSumResponse getInoutDashboardData(
			Long companyId, String type, Long materialId, Long siteId, Long orderId,
			LocalDate startDate, LocalDate endDate) {
		
		// 건수 계산
		long totalCount = stockInoutRepository.totalCountInout(companyId); // 총 건수
		long countIn = stockInoutRepository.countInout(companyId, "입고"); // 입고 건수
		long countOut = stockInoutRepository.countInout(companyId, "출고"); // 출고 건수
		long countToday = stockInoutRepository.countInoutToday(companyId); // 금일 건수
		
		// 필터 적용 입출고 목록
		List<StockInout> filteredList = stockInoutRepository.inoutListByFilters(
				companyId, type, materialId, siteId, orderId, startDate, endDate);
		
		// 입출고 요약
		long totalInQty = stockInoutRepository.calculQtyByFilters(
				companyId, "입고", materialId, siteId, orderId, startDate, endDate);
		long totalOutQty = stockInoutRepository.calculQtyByFilters(
				companyId, "출고", materialId, siteId, orderId, startDate, endDate);
		long netInOutQty = totalInQty - totalOutQty;
		long totalProcessedCount = filteredList.size();
		
		InOutSumResponse res = new InOutSumResponse();
		res.setTotalCount(totalCount);
		res.setInCount(countIn);
		res.setOutCount(countOut);
		res.setTodayCount(countToday);
		
		res.setTotalInQty(totalInQty);
		res.setTotalOutQty(totalOutQty);
		res.setNetInOutQty(netInOutQty);
		res.setTotalProcessedCount(totalProcessedCount);
		
		res.setInOutList(filteredList);
		
		return res;
	}
	
	// 입고 등록 - 발주번호 선택 시 자동 완성
	@Transactional(readOnly = true)
	public Map<String, Object> getAutoFill(Long orderId) {
		Orders orders = orderRepository.findById(orderId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 발주서입니다."));
		
		Map<String, Object> data = new HashMap<String, Object>();

		List<Map<String, Object>> materialList = orders.getItems().stream().map(i -> {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("materialId", i.getMaterial().getId());
			m.put("materialName", i.getMaterial().getMaterialName());
			m.put("materialCode", i.getMaterial().getMaterialCode());
			m.put("unit", i.getMaterial().getUnit());
			m.put("quantity", i.getQuantity());
			
			return m;
		}).collect(Collectors.toList());
		
		data.put("items", materialList);
		return data;
	}
	
	@Transactional
	public void registerStockInout(InOutRegRequest req) {
		Site site = req.getSiteId() != null ?
				siteRepository.findById(req.getSiteId()).orElse(null) : null;
		Orders orders = req.getOrderId() != null ?
				orderRepository.findById(req.getOrderId()).orElse(null) : null;
		Contact contact = req.getContactId() != null ?
				contactRepository.findById(req.getContactId()).orElse(null) : null;
		
		for (InOutRegRequest.ItemDetail item : req.getItems()) {
			Material material = materialRepository.findById(item.getMaterialId())
					.orElseThrow(() -> new IllegalArgumentException("존재하지 않은 자재입니다. " + item.getMaterialId()));
			
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
}
