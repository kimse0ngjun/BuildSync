package com.buildsync.service.order;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.order.OrderItemsDTO;
import com.buildsync.dto.order.OrderRequest;
import com.buildsync.dto.order.OrderStatusResponse;
import com.buildsync.dto.order.OrdersDTO;
import com.buildsync.entity.Company;
import com.buildsync.entity.Contact;
import com.buildsync.entity.Material;
import com.buildsync.entity.OrderItems;
import com.buildsync.entity.Orders;
import com.buildsync.entity.SupMaterial;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.company.ContactRepository;
import com.buildsync.repository.material.SupMaterialRepository;
import com.buildsync.repository.order.OrderItemsRepository;
import com.buildsync.repository.order.OrderRepository;
import com.buildsync.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final NotificationService notificationService;

	private final OrderRepository orderRepository;
	private final OrderItemsRepository orderItemsRepository;
	private final CompanyRepository companyRepository;
	private final ContactRepository contactRepository;
	private final SupMaterialRepository supMaterialRepository;
	
	// 발주서 작성 등록
	@Transactional
	public void registOrder(OrderRequest orderReq) {
		
		OrdersDTO orderDto = orderReq.getOrders();
		
		Company companyRef = Company.builder()
				.id(orderDto.getCompanyId())
				.build();
		
		Contact contactRef = Contact.builder()
				.contactId(orderDto.getContactId())
				.build();
		
		Orders orders = Orders.builder()
				.company(companyRef)
				.contact(contactRef)
				.orderDate(orderDto.getOrderDate())
				.expectedDeliveryDate(orderDto.getExpectedDeliveryDate())
				.totalAmount(orderDto.getTotalAmount())
				.status("PENDING") // enum 1 처리 🚨
				.memo(orderDto.getMemo())
				.build();
		
		Orders savedOrder = orderRepository.save(orders);
		
		List<OrderItemsDTO> itemDto = orderReq.getOrderItems();
		
		if (itemDto != null && !itemDto.isEmpty()) {
		    for (OrderItemsDTO dto : itemDto) { 

		        Material materialRef = Material.builder()
		                .id(dto.getMaterialId())
		                .build();

		        OrderItems item = OrderItems.builder()
		                .orders(savedOrder)
		                .material(materialRef)
		                .unitPrice(dto.getUnitPrice())
		                .quantity(dto.getQuantity())
		                .amount(dto.getAmount())
		                .build();

		        orderItemsRepository.save(item);
		    }
		}
		
		// 발주서 알림 테이블 저장
		notificationService.sendNotification(
				orderDto.getCompanyId(),
				"NEW_ORDER",
				"신규 발주 요청 건",
				"새로운 자재 발주서가 접수되었습니다. 확인해 주세요.",
				savedOrder.getOrderId()
		);
	}
	
	// 발주서 속 공급업체 목록
	@Transactional(readOnly = true)
	public List<Company> getSupplierList() {
		return companyRepository.findByCompanyType("공급업체");
	}
	
	// 발주서 속 공급업체 담당자 자동 출력
	@Transactional(readOnly = true)
	public List<Contact> getContactList(Long companyId) {
		return contactRepository.findByCompany_Id(companyId);
	}
	
	// 발주서 속 자재 목록
	@Transactional(readOnly = true)
	public List<SupMaterial> getOurMaterialList(Long companyId) {
		return supMaterialRepository.findByCompany_Id(companyId);
	}
	
	// 건설업체 화면 발주 목록 (검색 + 상태 필터)
	@Transactional(readOnly = true)
	public List<Orders> getOrderListForConstruction(Long companyId, String status, String keyword) {
		String searchStatus = (status != null && !status.trim().isEmpty()) ? status : null;
		String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword : null;
		
		return orderRepository.searchOrdersForConstruction(companyId, searchStatus, searchKeyword);
	}
	
	// 공급업체 화면 발주 목록 (검색 + 상태 필터)
	@Transactional(readOnly = true)
	public List<Orders> getOrderListForSupplier(Long companyId, String status, String keyword) {
		String searchStatus = (status != null && !status.trim().isEmpty()) ? status : null;
		String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword : null;
		
		return orderRepository.searchOrdersForSupplier(companyId, searchStatus, searchKeyword);
	}
	
	// 발주서 상세 보기
	@Transactional(readOnly = true)
	public Orders getOrderDetail(Long orderId) {
		return orderRepository.findByOrderDetail(orderId);
	}
	
	// 건설업체 화면 상단 상태 카드 (enum 처리 4)
	public OrderStatusResponse getStatusCountsForConstruction(Long companyId) {
		long total = orderRepository.countByCompanyId(companyId);
		long pending = orderRepository.countByCompanyIdAndStatus(companyId, "PENDING");
		long accepted = orderRepository.countByCompanyIdAndStatus(companyId, "ACCEPTED");
		long end = orderRepository.countByCompanyIdAndStatus(companyId, "END");
		long canceled = orderRepository.countByCompanyIdAndStatus(companyId, "CANCELED");
		
		return new OrderStatusResponse(total, pending, accepted, end, canceled);
	}
	
	// 공급업체 화면 상단 상태 카드 (enum 처리 4)
	public OrderStatusResponse getStatusCountsForSupplier(Long companyId) {
		long total = orderRepository.countByContact_Company_Id(companyId);
		long pending = orderRepository.countByContact_Company_IdAndStatus(companyId, "PENDING");
		long accepted = orderRepository.countByContact_Company_IdAndStatus(companyId, "ACCEPTED");
		long end = orderRepository.countByContact_Company_IdAndStatus(companyId, "END");
		long canceled = orderRepository.countByContact_Company_IdAndStatus(companyId, "CANCELED");
		
		return new OrderStatusResponse(total, pending, accepted, end, canceled);
	}
	
	// 건설업체 발주서 수정
	@Transactional
    public void modifyOrderByCompany(Long orderId, OrderRequest dto) {
        Orders order = orderRepository.findByOrderDetail(orderId);
        if (order == null) {
			throw new IllegalArgumentException("해당 발주서가 없습니다.");
		}

        // enum 처리 1 🚨
        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException("대기 중인 발주서만 수정할 수 있습니다.");
        }
        
        // enum 처리 2 🚨
        if ("CANCELED".equals(dto.getOrders().getStatus())) {
			order.changeStatus("CANCELED");
			
			// 공급업체가 받을 발주서 취소 알림
			notificationService.sendNotification(
        		order.getCompany().getId(),
        		"ORDER_CANCELED",
        		"발주서 수정 알림",
        		"건설사 요청에 의해 발주서 #" + orderId + "건의 취소되었습니다.",
        		orderId
        	);
		} else {
			
			List<OrderItems> newOrderItems = dto.getOrderItems().stream()
	        		.map(itemDto -> {
	        		Material materialRef = Material.builder()
	        					.id(itemDto.getMaterialId())
	        					.build();
	        			
	        		return OrderItems.builder()
	        				.material(materialRef)
	        				.unitPrice(itemDto.getUnitPrice())
	        				.quantity(itemDto.getQuantity())
	        				.amount(itemDto.getAmount())
	        				.build();
	                })
	        		.toList();
			
			order.modifyOrderDetails(dto.getOrders().getMemo(), newOrderItems);
			
			// 공급업체가 받을 발주서 수정 알림
			notificationService.sendNotification(
					order.getCompany().getId(),
					"ORDER_MODIFIED",
					"발주서 수정 알림",
					"대기 중인 발주서 #" + orderId + "건의 상세 내용이 수정되었습니다.",
					orderId
			);
		}
    }
	
	// 공급업체 발주서 수정
	@Transactional
    public void updateStatusBySupplier(Long orderId, String status) {
		Orders order = orderRepository.findByOrderDetail(orderId);
		if (order == null) {
			throw new IllegalArgumentException("해당 발주서가 없습니다.");
		}

        order.changeStatus(status);
        
        // 공급업체 발주 상태 변경 enum 처리 3 🚨
        Long constructionCompanyId = order.getConstructionCompanyId();
        
        // 건설업체가 받을 발주 수락 알림
        if ("ACCEPTED".equals(status)) {
			notificationService.sendNotification(
					constructionCompanyId,
					"ORDER_APPROVED",
					"발주 수락 완료",
					"공급업체에서 접수를 완료했습니다. 자재 배송을 준비합니다.",
					orderId
		);
		// 건설업체가 받을 발주 거절 알림
		} else if ("CANCELED".equals(status)) {
			notificationService.sendNotification(
					constructionCompanyId,
					"ORDER_REJECTED",
					"발주 처리 취소 안내",
					"공급업체 사정 혹은 요청에 의해 발주서 건이 취소(거절)되었습니다.",
					orderId
		);
		// 건설업체가 받을 발주 완료 알림
		} else if ("END".equals(status)) {
			notificationService.sendNotification(
					constructionCompanyId,
					"DELIVERY_START",
					"자재 배송 완료 (출발)",
					"발주하신 모든 자재의 출고 및 배송 준비가 완료되었습니다. 현장으로 출발합니다.",
					orderId
		);
		}
    }
}
