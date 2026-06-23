package com.buildsync.controller.inout;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.inout.InOutRegRequest;
import com.buildsync.dto.inout.InOutResponse;
import com.buildsync.dto.inout.InOutSumResponse;
import com.buildsync.dto.inout.SelectResponse;
import com.buildsync.dto.inout.StockInfoResponse;
import com.buildsync.service.inout.StockInoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inout")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
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
			@RequestParam(value = "keyword", required = false) String keyword,
			@PageableDefault(page = 0, size = 10) Pageable pageable) {
		
		InOutSumResponse data = stockInoutService.getInoutDashboardData(
				companyId, type, materialId, siteId, orderId, startDate, endDate, keyword, pageable);
		
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
	
	@PatchMapping("/update/{stockInoutId}")
	public ResponseEntity<String> updateInout(@PathVariable("stockInoutId") Long stockInoutId, @RequestBody InOutRegRequest req) {
		if (req.getType() == null || req.getItems() == null || req.getItems().isEmpty()) {
			return ResponseEntity.badRequest().body("필수 등록 정보가 비어있습니다.");
		}
		
		try {
			stockInoutService.updateInoutStock(stockInoutId, req);
			return ResponseEntity.ok("입출고 내역이 성공적으로 수정되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/detail")
	public ResponseEntity<InOutResponse> detailInout(
	        @RequestParam(value = "orderId", required = false) Long orderId,
	        @RequestParam(value = "processedDate", required = false) String processedDate,
	        @RequestParam(value = "siteId", required = false) Long siteId,
	        @RequestParam(value = "contactId", required = false) Long contactId,
	        @RequestParam(value = "type", required = false) String type) {

	    InOutResponse res = stockInoutService.getInoutDetail(
	            orderId,
	            processedDate,
	            siteId,
	            contactId,
	            type);

	    return ResponseEntity.ok(res);
	}
	
	@GetMapping("/detail/{stockInoutId}")
	public ResponseEntity<InOutResponse> detailInoutById(
	        @PathVariable("stockInoutId") Long stockInoutId) {

	    InOutResponse res = stockInoutService.getInoutDetailById(stockInoutId);

	    return ResponseEntity.ok(res);
	}
	
	@GetMapping("/materials")
	public ResponseEntity<List<SelectResponse>> materials() {
	    return ResponseEntity.ok(stockInoutService.getMaterials());
	}

	@GetMapping("/sites")
	public ResponseEntity<List<SelectResponse>> sites() {
	    return ResponseEntity.ok(stockInoutService.getSites());
	}

	@GetMapping("/orders")
	public ResponseEntity<List<SelectResponse>> orders(@RequestParam("companyId") Long companyId) {
	    return ResponseEntity.ok(stockInoutService.getOrders(companyId));
	}
}
