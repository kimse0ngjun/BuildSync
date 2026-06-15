package com.buildsync.service.inout;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.inout.InOutRegRequest;
import com.buildsync.dto.inout.InOutResponse;
import com.buildsync.dto.inout.InOutSumResponse;
import com.buildsync.entity.Contact;
import com.buildsync.entity.Material;
import com.buildsync.entity.Orders;
import com.buildsync.entity.Site;
import com.buildsync.entity.StockInout;
import com.buildsync.entity.SupStock;
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
	
	// 입출고 등록 + 자재 변동 처리
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
					.orElseThrow(() -> new IllegalArgumentException("존재하지 않은 자재입니다."));
			
			Long companyId = req.getCompanyId();
			SupStock supStock = supStockRepository
					.findByCompanyIdAndMaterialId(companyId, material.getId())
					.orElseThrow(() -> new IllegalArgumentException("해당 회사가 취급하지 않는 자재입니다."));
			
			int updatedStock = 0;
			if ("입고".equals(req.getType())) {
				updatedStock = supStock.getCurrentQuantity() + item.getQuantity();
			} else if ("출고".equals(req.getType())) {
				updatedStock = supStock.getCurrentQuantity() - item.getQuantity();
				
				if (updatedStock < 0) {
					throw new IllegalStateException(material.getMaterialName() + "의 재고가 부족합니다."
							+ "\n현재 재고 (" + supStock.getCurrentQuantity() + material.getUnit() + ")");
				}
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
	
	// 입출고 수정 + 자재 변동 처리 (yet)
	@Transactional
	public void updateInoutStock(InOutRegRequest req) {
		Site site = req.getSiteId() != null ? siteRepository.findById(req.getSiteId()).orElse(null) : null;
		Orders orders = req.getOrderId() != null ? orderRepository.findById(req.getOrderId()).orElse(null) : null;
		Contact contact = req.getContactId() != null ? contactRepository.findById(req.getContactId()).orElse(null) : null;
		
		Long companyId = req.getCompanyId();
		
		if (req.getDeleteInoutIds() != null && !req.getDeleteInoutIds().isEmpty()) {
			List<StockInout> oldInoutList = stockInoutRepository.findAllById(req.getDeleteInoutIds());
			
			if (oldInoutList.size() != req.getDeleteInoutIds().size()) {
	            throw new IllegalArgumentException("수정하려는 이력 중 이미 삭제되었거나 존재하지 않는 내역이 포함되어 있습니다.");
	        }
			
			for (StockInout stockInout : oldInoutList) {
				SupStock oldStock = supStockRepository
						.findByCompanyIdAndMaterialId(companyId, stockInout.getMaterial().getId())
						.orElseThrow(() -> new IllegalArgumentException("기존 자재의 정보를 찾을 수 없습니다."));
				
				int rollbackQty = oldStock.getCurrentQuantity();
				if ("입고".equals(stockInout.getType())) {
					rollbackQty -= stockInout.getQuantity();
				} else if ("출고".equals(stockInout.getType())) {
					rollbackQty += stockInout.getQuantity();
				}
				
				oldStock.changeCurStock(rollbackQty);
			}
			stockInoutRepository.deleteAll(oldInoutList);
		}
		
		for (InOutRegRequest.ItemDetail item : req.getItems()) {
			Material material = materialRepository.findById(item.getMaterialId())
					.orElseThrow(() -> new IllegalArgumentException("존재하지 않은 자재입니다."));
			
			SupStock newSupStock = supStockRepository
					.findByCompanyIdAndMaterialId(companyId, material.getId())
					.orElseThrow(() -> new IllegalArgumentException("해당 회사가 취급하지 않는 자재입니다."));
			
			int updatedStock = newSupStock.getCurrentQuantity();
			if ("입고".equals(req.getType())) {
				updatedStock += item.getQuantity();
			} else if ("출고".equals(req.getType())) {
				updatedStock -= item.getQuantity();
				
				if (updatedStock < 0) {
					throw new IllegalStateException(material.getMaterialName() + "의 재고가 부족하여 수정할 수 없습니다.");
				}
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
	
	// 입출고 내역 삭제
	public void deleteInoutStock(List<Long> deleteInoutIds, Long companyId) {		
		if (deleteInoutIds == null || deleteInoutIds.isEmpty()) {
			throw new IllegalArgumentException("삭제할 입출고 내역이 존재하지 않습니다.");
		}
		
		List<StockInout> oldInoutList = stockInoutRepository.findAllById(deleteInoutIds);
		
		if (oldInoutList.isEmpty()) {
			throw new IllegalArgumentException("요청된 ID에 해당하는 입출고 내역을 찾을 수 없습니다.");
		}
		
		for (StockInout stockInout : oldInoutList) {
			SupStock supStock = supStockRepository
					.findByCompanyIdAndMaterialId(companyId, stockInout.getMaterial().getId())
					.orElseThrow(() -> new IllegalArgumentException(
							stockInout.getMaterial().getMaterialName() + "의 정보를 찾을 수 없습니다.")
							);
			int rollbackQty = supStock.getCurrentQuantity();
			
			if ("입고".equals(stockInout.getType())) {
				rollbackQty -= stockInout.getQuantity();
				
				if (rollbackQty < 0) {
	                throw new IllegalStateException(stockInout.getMaterial().getMaterialName() + 
	                        " 자재는 이미 다른 현장에서 출고되어 사용 중이므로 입고 내역을 삭제할 수 없습니다.");
	            }
			} else if ("출고".equals(stockInout.getType())) {
				rollbackQty += stockInout.getQuantity();
			}
			
			supStock.changeCurStock(rollbackQty);
		}
		
		stockInoutRepository.deleteAll(oldInoutList);
	}
	
	// 입출고 상세
	@Transactional(readOnly = true)
	public InOutResponse getInoutDetail(Long orderId, String dateStr, Long siteId, Long contactId, String type) {
		List<StockInout> inoutList;
		
		if (orderId != null) {
			inoutList = stockInoutRepository.findByOrderId(orderId);
		} else {
			java.sql.Date processedDate = java.sql.Date.valueOf(dateStr);
			inoutList = stockInoutRepository.findByProcessedDateAndSiteAndContactIdAndType(processedDate, siteId, contactId, type);
		}
		
		if (inoutList.isEmpty()) {
			throw new IllegalArgumentException("해당 조건의 입출고 내역 상세 정보를 찾을 수 없습니다.");
		}
		
		StockInout si = inoutList.get(0);
		
		List<InOutResponse.ItemInfo> itemInfo = inoutList.stream()
				.map(i -> InOutResponse.ItemInfo.builder()
						.stockInoutId(i.getId())
						.materialId(i.getMaterial().getId())
						.materialName(i.getMaterial().getMaterialName())
						.quantity(i.getQuantity())
						.build())
				.collect(Collectors.toList());
		
		return InOutResponse.builder()
				.siteId(si.getSite() != null ? si.getSite().getId() : null)
				.siteName(si.getSite() != null ? si.getSite().getSiteName() : null)
				.orderId(si.getOrders() != null ? si.getOrders().getOrderId() : null)
				.contactId(si.getContact() != null ? si.getContact().getContactId() : null)
				.contactName(si.getContact() != null ? si.getContact().getContactName() : null)
				.type(si.getType())
				.processedDate(si.getProcessedDate().toString())
				.memo(si.getMemo())
				.items(itemInfo)
				.build();
	}
}
