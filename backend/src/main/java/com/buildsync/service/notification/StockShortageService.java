package com.buildsync.service.notification;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.notification.MaterialShortageResponse;
import com.buildsync.dto.notification.StockShortageResponse;
import com.buildsync.entity.SupStock;
import com.buildsync.repository.material.SupStockRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockShortageService {
	
	private final SupStockRepository supStockRepository;

	// 재고 부족 페이지 - 상단 카드
		@Transactional(readOnly = true)
		public StockShortageResponse getStockShortageBoard(Long companyId) {
			List<SupStock> list = supStockRepository.findShortageStocks(companyId);
			
			long warningCount = list.size(); // 최소 재고 이하 전체 건수
			long criticalCount = supStockRepository.countCriticalStocks(companyId); // 30% 이하 심각 자재
			long onOrderCount = supStockRepository.countOnOrderMaterials(companyId); // 발주중
			long estimatedRequiredCost = list.stream()
					.mapToLong(s -> (s.getMinimumQuantity() - s.getCurrentQuantity()) * s.getUnitPrice())
					.sum(); // 예상 확보 비용
			
			return new StockShortageResponse(criticalCount, warningCount, onOrderCount, estimatedRequiredCost);
		}
		
		// 재고 부족 목록 조회
		@Transactional(readOnly = true)
		public List<MaterialShortageResponse> getShortageMaterial(Long companyId) {
			List<SupStock> list = supStockRepository.findShortageStocks(companyId);
			
			return list.stream().map(s -> {
				int deficit = s.getMinimumQuantity() - s.getCurrentQuantity();
				
				String statusMessage = (s.getCurrentQuantity() <= (s.getMinimumQuantity() * 0.3)) ? "위험" : "주의";
				
				return new MaterialShortageResponse(
						s.getMaterial().getId(),
						s.getMaterial().getMaterialName(),
						s.getCurrentQuantity(),
						s.getMinimumQuantity(),
						deficit,
						s.getUnitPrice(),
						statusMessage);
			}).collect(Collectors.toList());
		}
}
