package com.buildsync.controller.notification;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.notification.MaterialShortageResponse;
import com.buildsync.dto.notification.StockShortageResponse;
import com.buildsync.dto.paging.PageResponse;
import com.buildsync.service.notification.StockShortageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shortage")
@RequiredArgsConstructor
public class StockShortageController {

	private final StockShortageService stockShortageService;
	
	// 재고 부족 알림 페이지 상단 카드
	@GetMapping("/card")
	public ResponseEntity<StockShortageResponse> getStockShortageBoard(@RequestParam("companyId") Long companyId) {
		StockShortageResponse board = stockShortageService.getStockShortageBoard(companyId);
		return ResponseEntity.ok(board);
	}
	
	// 재고 부족 목록
	@GetMapping("/list")
	public ResponseEntity<PageResponse<MaterialShortageResponse>> getShortageMaterial(
			@RequestParam("companyId") Long companyId,
			@PageableDefault(page = 0, size = 10) Pageable pageable) {
		
		PageResponse<MaterialShortageResponse> list = stockShortageService.getShortageMaterial(companyId, pageable);
		
		return ResponseEntity.ok(list);
	}
}
