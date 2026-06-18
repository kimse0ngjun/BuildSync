package com.buildsync.controller.inout;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.inout.InOutRegRequest;
import com.buildsync.dto.inout.InOutResponse;
import com.buildsync.dto.inout.InOutSumResponse;
import com.buildsync.dto.inout.StockInfoResponse;
import com.buildsync.service.inout.StockInoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inout")
@RequiredArgsConstructor
public class StockInoutController {

	private final StockInoutService stockInoutService;
	
	@GetMapping("/dashboard")
	public ResponseEntity<InOutSumResponse> getInoutList(
			@RequestParam("companyId") Long companyId,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "materialId", required = false) Long materialId,
			@RequestParam(value = "siteId", required = false) Long siteId,
			@RequestParam(value = "orderId", required = false) Long orderId,
			
			@RequestParam(value = "startDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(value = "endDate", required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
			@RequestParam(value = "keyword", required = false) String keyword) {
		
		InOutSumResponse data = stockInoutService.getInoutDashboardData(
				companyId, type, materialId, siteId, orderId, startDate, endDate, keyword);
		
		return ResponseEntity.ok(data);
	}
	
	@GetMapping("/auto-fill")
	public ResponseEntity<Map<String, Object>> getAutoFill(@RequestParam("orderId") Long orderId) {
		Map<String, Object>	autoFillData = stockInoutService.getAutoFill(orderId);
		return ResponseEntity.ok(autoFillData);
	}
	
	// 입출고 등록
	@PostMapping("/regist")
	public ResponseEntity<String> registerInout(@RequestBody InOutRegRequest req) {
		if (req.getType() == null || req.getItems() == null || req.getItems().isEmpty()) {
			return ResponseEntity.badRequest().body("필수 등록 정보가 비어있습니다.");
		}
		
		try {
			stockInoutService.registerStockInout(req);
			return ResponseEntity.ok("입출고 내역이 성공적으로 등록되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}		
	}
	
	// 등록 - 자재 선택 시 정보
	@GetMapping("/stock-info")
	public ResponseEntity<StockInfoResponse> getPureStockInfo(
			@RequestParam("companyId") Long companyId,
			@RequestParam("materialId") Long materialId) {
		StockInfoResponse res = stockInoutService.getPureStockInfo(companyId, materialId);
		return ResponseEntity.ok(res);
	}
	
	// 등록 - 미리보기 + 예상
	@GetMapping("/stock-calc")
	public ResponseEntity<StockInfoResponse> getStockCalculation(
			@RequestParam("companyId") Long companyId,
			@RequestParam("materialId") Long materialId,
			@RequestParam("type") String type,
			@RequestParam(value = "quantity", required = false) Integer quantity,
			@RequestParam(value = "unitPrice", required = false) Integer unitPrice) {
		StockInfoResponse res = stockInoutService.getStockCalculation(
				companyId, materialId, type, quantity, unitPrice);
		return ResponseEntity.ok(res);
	}
	
	@PatchMapping("/update")
	public ResponseEntity<String> updateInout(@RequestBody InOutRegRequest req) {
		if (req.getType() == null || req.getItems() == null || req.getItems().isEmpty()) {
			return ResponseEntity.badRequest().body("필수 등록 정보가 비어있습니다.");
		}
		
		try {
			stockInoutService.updateInoutStock(req);
			return ResponseEntity.ok("입출고 내역이 성공적으로 수정되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/detail")
	public ResponseEntity<?> detailInout(
			@RequestParam(value = "orderId", required = false) Long orderId,
			@RequestParam(value = "processedDate", required = false) String processedDate,
			@RequestParam(value = "siteId", required = false) Long siteId,
			@RequestParam(value = "contactId", required = false) Long contactId,
			@RequestParam(value = "type", required = false) String type) {
		try {
			InOutResponse res = stockInoutService.getInoutDetail(orderId, processedDate, siteId, contactId, type);
			return ResponseEntity.ok(res);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
