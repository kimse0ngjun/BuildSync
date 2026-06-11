package org.cloud.service;

import java.util.List;

import org.cloud.domain.Company;
import org.cloud.domain.Contact;
import org.cloud.domain.Material;
import org.cloud.domain.OrderItems;
import org.cloud.domain.Orders;
import org.cloud.domain.SupMaterial;
import org.cloud.dto.OrderItemsDTO;
import org.cloud.dto.OrderRequest;
import org.cloud.dto.OrdersDTO;
import org.cloud.repository.CompanyRepositoy;
import org.cloud.repository.ContactRepository;
import org.cloud.repository.OrderItemsRepository;
import org.cloud.repository.OrderRepository;
import org.cloud.repository.SupMaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private final OrderItemsRepository orderItemsRepository;
	private final CompanyRepositoy companyRepository;
	private final ContactRepository contactRepository;
	private final SupMaterialRepository supMaterialRepository;
	
	// 발주서 작성 등록
	@Transactional
	public void registOrder(OrderRequest orderReq) {
		
		OrdersDTO orderDto = orderReq.getOrders();
		
		Company companyRef = Company.builder()
				.companyId(orderDto.getCompanyId())
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
				.status("PENDING")
				.memo(orderDto.getMemo())
				.build();
		
		Orders savedOrder = orderRepository.save(orders);
		
		List<OrderItemsDTO> itemDto = orderReq.getOrderItems();
		
		if (itemDto != null) {
		    for (OrderItemsDTO orderItemsDTO : itemDto) {
		        
		    	Material materialRef = Material.builder()
		                .materialId(orderItemsDTO.getMaterialId())
		                .build();

		        OrderItems.OrderItemsBuilder itemBuilder = OrderItems.builder();	        
		        itemBuilder
		                .orderItemId(savedOrder.getOrderId())
		                .material(materialRef)
		                .unitPrice(orderItemsDTO.getUnit_price())
		                .quantity(orderItemsDTO.getQuantity())
		                .amount(orderItemsDTO.getAmount());
		                
		        OrderItems item = itemBuilder.build();
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
		return contactRepository.findByCompanyId(companyId);
	}
	
	// 발주서 속 자재 목록
	@Transactional(readOnly = true)
	public List<SupMaterial> getOurMaterialList(Long companyId) {
		return supMaterialRepository.findByCompanyId(companyId);
	}
	
	// 건설업체 화면 발주 목록
	@Transactional(readOnly = true)
	public List<Orders> getOrderListForConstruction(Long companyId) {
		return orderRepository.findByConstructionOrders(companyId);
	}
	
	// 공급업체 화면 발주 목록
	@Transactional(readOnly = true)
	public List<Orders> getOrderListForSupplier(Long contactId) {
		return orderRepository.findByOrdersToSupplier(contactId);
	}
}
