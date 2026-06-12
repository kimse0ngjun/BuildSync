package com.buildsync.controller.inout;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.inout.InOutRegRequest;
import com.buildsync.dto.inout.InOutSumResponse;
import com.buildsync.service.inout.StockInoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inout")
@RequiredArgsConstructor
public class StockInoutController {

	private StockInoutService stockInoutService;
	
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
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
		
		InOutSumResponse data = stockInoutService.getInoutDashboardData(
				companyId, type, materialId, siteId, orderId, startDate, endDate);
		
		return ResponseEntity.ok(data);
	}
	
	@GetMapping("/auto-fill")
	public ResponseEntity<Map<String, Object>> getAutoFill(@RequestParam("orderId") Long orderId) {
		Map<String, Object>	autoFillData = stockInoutService.getAutoFill(orderId);
		return ResponseEntity.ok(autoFillData);
	}
	
	public ResponseEntity<String> registerInout(@RequestBody InOutRegRequest req) {
		if (req.getType() == null || req.getItems() == null || req.getItems().isEmpty()) {
			return ResponseEntity.badRequest().body("필수 등록 정보가 비어있습니다.");
		}
		
		stockInoutService.registerStockInout(req);
		return ResponseEntity.ok("입출고 내역이 성공적으로 등록되었습니다.");
	}
}
