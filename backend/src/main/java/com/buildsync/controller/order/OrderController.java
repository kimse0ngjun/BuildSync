package com.buildsync.controller.order;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buildsync.dto.order.OrderRequest;
import com.buildsync.entity.Company;
import com.buildsync.entity.Contact;
import com.buildsync.entity.Orders;
import com.buildsync.entity.SupMaterial;
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
	public ResponseEntity<List<Contact>> getContact(@RequestParam("companyId") Long companyId) {
		List<Contact> contact = orderService.getContactList(companyId);
		return ResponseEntity.ok(contact);
	}
	
	// 자재 목록
	@GetMapping("/material")
	public ResponseEntity<List<SupMaterial>> getOurMaterial(@RequestParam("companyId") Long companyId) {
		List<SupMaterial> material = orderService.getOurMaterialList(companyId);
		return ResponseEntity.ok(material);
	}
	
	// 건설&공급업체 발주서 목록 화면
	@GetMapping("/list")
	public ResponseEntity<List<Orders>> getOrderList(
			@RequestParam("companyId") Long companyId,
			@RequestParam("companyType") String companyType) {
		if ("건설업체".equals(companyType)) {
			return ResponseEntity.ok(orderService.getOrderListForConstruction(companyId));
		} else if ("공급업체".equals(companyType)) {
			return ResponseEntity.ok(orderService.getOrderListForSupplier(companyId));
		}
		return ResponseEntity.badRequest().body(java.util.Collections.emptyList());
	}
	
	// 발주서 상세 화면
	@GetMapping("/detail/{orderId}")
	public ResponseEntity<Orders> getOrderDetail(@PathVariable("orderId") Long orderId) {
		return ResponseEntity.ok(orderService.getOrderDetail(orderId));
	}
	
	// 발주서 수정
	@PutMapping("/update/{orderId}")
	public ResponseEntity<String> updateOrderDetail(
			@PathVariable("orderId") Long orderId,
			@RequestBody OrderRequest orderReq) {
		try {
			if (orderReq.getOrders() != null && orderReq.getOrders().getStatus() != null) {
				String newStatus = orderReq.getOrders().getStatus();
				orderService.updateStatusBySupplier(orderId, newStatus);
				return ResponseEntity.ok("발주서 상태가 [" + newStatus + "](으)로 변경되었습니다.");
			} else {
				orderService.modifyOrderByCompany(orderId, orderReq);
				return ResponseEntity.ok("발주서 수정이 완료되었습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
