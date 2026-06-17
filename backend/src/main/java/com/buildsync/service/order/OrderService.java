package com.buildsync.service.order;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.order.OrderItemsDTO;
import com.buildsync.dto.order.OrderRequest;
import com.buildsync.dto.order.OrdersDTO;
import com.buildsync.entity.Company;
import com.buildsync.entity.Contact;
import com.buildsync.entity.Material;
import com.buildsync.entity.OrderItems;
import com.buildsync.entity.OrderStatus;
import com.buildsync.entity.Orders;
import com.buildsync.entity.SupMaterial;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.company.ContactRepository;
import com.buildsync.repository.material.SupMaterialRepository;
import com.buildsync.repository.order.OrderItemsRepository;
import com.buildsync.repository.order.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

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
				.status(OrderStatus.PENDING)
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
	
	// 건설업체 화면 발주 목록
	@Transactional(readOnly = true)
	public List<Orders> getOrderListForConstruction(Long companyId) {
		return orderRepository.findByConstructionOrders(companyId);
	}
	
	// 공급업체 화면 발주 목록
	@Transactional(readOnly = true)
	public List<Orders> getOrderListForSupplier(Long companyId) {
		return orderRepository.findByOrdersToSupplier(companyId);
	}
	
	// 발주서 상세 보기
	@Transactional(readOnly = true)
	public Orders getOrderDetail(Long orderId) {
		return orderRepository.findByOrderDetail(orderId);
	}
	
	 // 건설업체 발주서 수정
	@Transactional
    public void modifyOrderByCompany(Long orderId, OrderRequest dto) {
        Orders order = orderRepository.findByOrderDetail(orderId);
        if (order == null) {
			throw new IllegalArgumentException("해당 발주서가 없습니다.");
		}

        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException("대기 중인 발주서만 수정할 수 있습니다.");
        }

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
    }
	
	// 공급업체 발주서 수정
	@Transactional
	public void updateStatusBySupplier(Long orderId, String status) {
	    Orders order = orderRepository.findByOrderDetail(orderId);

	    if (order == null) {
	        throw new IllegalArgumentException("해당 발주서가 없습니다.");
	    }

	    OrderStatus orderStatus;
	    try {
	        orderStatus = OrderStatus.valueOf(status);
	    } catch (IllegalArgumentException e) {
	        throw new IllegalArgumentException("잘못된 상태값입니다: " + status);
	    }

	    order.changeStatus(orderStatus);
	}
}
