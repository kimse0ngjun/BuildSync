package com.buildsync.controller.notification;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.notification.MaterialShortageResponse;
import com.buildsync.dto.notification.StockShortageResponse;
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
	@GetMapping("/shortage-list")
	public ResponseEntity<List<MaterialShortageResponse>> getShortageMaterial(@RequestParam("companyId") Long companyId) {
		List<MaterialShortageResponse> list = stockShortageService.getShortageMaterial(companyId);
		return ResponseEntity.ok(list);
	}
}
