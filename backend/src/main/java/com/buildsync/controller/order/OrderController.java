package com.buildsync.controller.order;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.inout.SelectResponse;
import com.buildsync.dto.order.ContactResponse;
import com.buildsync.dto.order.MaterialSelectResponse;
import com.buildsync.dto.order.OrderDetailResponse;
import com.buildsync.dto.order.OrderListResponse;
import com.buildsync.dto.order.OrderRequest;
import com.buildsync.dto.order.OrderStatusResponse;
import com.buildsync.dto.paging.PageResponse;
import com.buildsync.entity.Company;
import com.buildsync.entity.OrderStatus;
import com.buildsync.service.order.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {

	private final OrderService orderService;
	
	// 발주서 작성 등록
	@PostMapping("/write")
	public ResponseEntity<String> registOrder(@RequestBody OrderRequest orderReq) {
		try {
			orderService.registOrder(orderReq);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("발주서 등록이 완료되었습니다.");
					
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류로 인해 발주서 등록에 실패했습니다: " + e.getMessage());
		}
	}
	
	// 공급업체 목록
	@GetMapping("/company")
	public ResponseEntity<List<Company>> getSupplierList() {
		List<Company> supplierList = orderService.getSupplierList();
		return ResponseEntity.ok(supplierList);
	}
	
	// 담당자 불러오기
	@GetMapping("/contact")
	public ResponseEntity<List<ContactResponse>> getContact(@RequestParam("companyId") Long companyId) {
		List<ContactResponse> contact = orderService.getContactList(companyId);
		return ResponseEntity.ok(contact);
	}
	
	// 자재 목록
	@GetMapping("/material")
	public ResponseEntity<List<MaterialSelectResponse>> getOurMaterial(@RequestParam("companyId") Long companyId) {
		List<MaterialSelectResponse> material = orderService.getMaterialsBySupplier(companyId);
		return ResponseEntity.ok(material);
	}
	
	// 공사 현장
	@GetMapping("/site")
    public ResponseEntity<List<SelectResponse>> getSiteListForSelect() {
        List<SelectResponse> site = orderService.getSiteListForSelect();
        return ResponseEntity.ok(site);
    }
	
	// 건설업체 발주 목록 (검색 + 상태 필터 + 페이징)
	@GetMapping("/construction")
	public ResponseEntity<PageResponse<OrderListResponse>> getOrderListForConstruction(
			@RequestParam("companyId") Long companyId,
			@RequestParam(value = "status", required = false) OrderStatus status,
			@RequestParam(value = "keyword", required = false) String keyword,
			@PageableDefault(page = 0, size = 10) Pageable pageable) {
		PageResponse<OrderListResponse> list = orderService.getOrderListForConstruction(companyId, status, keyword, pageable);
			return ResponseEntity.ok(list);
	}

	// 공급업체 발주 목록 (검색 + 상태 필터 + 페이징)
	@GetMapping("/supplier")
	public ResponseEntity<PageResponse<OrderListResponse>> getOrderListForSupplier(
			@RequestParam("companyId") Long companyId,
			@RequestParam(value = "status", required = false) OrderStatus status,
			@RequestParam(value = "keyword", required = false) String keyword,
			@PageableDefault(page = 0, size = 10) Pageable pageable) {
		PageResponse<OrderListResponse> list = orderService.getOrderListForSupplier(companyId, status, keyword, pageable);
		return ResponseEntity.ok(list);
	}
	
	// 발주서 상세 화면
	@GetMapping("/detail/{orderId}")
	public ResponseEntity<OrderDetailResponse> getOrderDetail(@PathVariable("orderId") Long orderId) {
		return ResponseEntity.ok(orderService.getOrderDetail(orderId));
	}
	
	// 건설업체 발주서 수정
	@PutMapping("/update/{orderId}")
	public ResponseEntity<String> modifyOrderByCompany(
			@PathVariable("orderId") Long orderId,
			@RequestBody OrderRequest orderReq) {
		try {
			orderService.modifyOrderByCompany(orderId, orderReq);
			return ResponseEntity.ok("발주서 수정이 완료되었습니다.");
		} catch (IllegalArgumentException | IllegalStateException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	// 건설업체 발주서 취소
	@PatchMapping("/cancel/{orderId}")
	public ResponseEntity<String> cancelOrderByConstruction(@PathVariable("orderId") Long orderId) {
		try {
			orderService.updateStatusBySupplier(orderId, "CANCELED");
			return ResponseEntity.ok("발주서가 성공적으로 취소되었습니다.");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	// 건설업체 발주서 상태 수정
	@PatchMapping("/update/status/{orderId}")
	public ResponseEntity<String> updateStatusBySupplier(
			@PathVariable("orderId") Long orderId,
			@RequestParam("status") String status) {
		try {
			orderService.updateStatusBySupplier(orderId, status);
			return ResponseEntity.ok("발주서 상태가 [" + status.toUpperCase() + "](으)로 변경되었습니다.");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	// 건설업체 상단 건수 카드
	@GetMapping("/counts/construction")
	public ResponseEntity<OrderStatusResponse> getConstructionCounts(@RequestParam("companyId") Long companyId) {
		OrderStatusResponse counts = orderService.getStatusCountsForConstruction(companyId);
		return ResponseEntity.ok(counts);
	}
	
	// 공급업체 상단 건수 카드
	@GetMapping("/counts/supplier")
	public ResponseEntity<OrderStatusResponse> getSupplierCounts(@RequestParam("companyId") Long companyId) {
		OrderStatusResponse counts = orderService.getStatusCountsForSupplier(companyId);
		return ResponseEntity.ok(counts);
	}
}
