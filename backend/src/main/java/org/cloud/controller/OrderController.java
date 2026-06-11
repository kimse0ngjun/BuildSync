package org.cloud.controller;

import java.util.List;

import org.cloud.domain.Company;
import org.cloud.domain.Contact;
import org.cloud.domain.Orders;
import org.cloud.domain.SupMaterial;
import org.cloud.dto.OrderRequest;
import org.cloud.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
@RequestMapping("/order")
public class OrderController {

	private final OrderService orderService;
	
	// 발주서 작성 등록
	@PostMapping("/write")
	public ResponseEntity<String> RegistOrder(@RequestBody OrderRequest orderReq) throws Exception {
		try {
			orderService.registOrder(orderReq);
			return ResponseEntity.status(HttpStatus.ACCEPTED).body("발주서 등록이 완료되었습니다.");
					
		} catch (Exception e) {
			e.printStackTrace();
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
	
//	// 건설&공급업체 발주서 목록 화면
//	@GetMapping("/list")
//	public ResponseEntity<List<Orders>> getOrderList(@AuthenticationPrincipal UserDetailsImpl loginUser) {
//		String companyType = loginUser.getCompanyId();
//		return ResponseEntity.ok(orderList);
//	}
	
	
}
