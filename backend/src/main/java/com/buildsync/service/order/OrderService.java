package com.buildsync.service.order;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buildsync.dto.inout.SelectResponse;
import com.buildsync.dto.order.ContactResponse;
import com.buildsync.dto.order.MaterialSelectResponse;
import com.buildsync.dto.order.OrderDetailResponse;
import com.buildsync.dto.order.OrderRequest;
import com.buildsync.dto.order.OrderStatusResponse;
import com.buildsync.dto.order.OrderListResponse;
import com.buildsync.dto.paging.PageResponse;
import com.buildsync.entity.Company;
import com.buildsync.entity.CompanyType;
import com.buildsync.entity.Contact;
import com.buildsync.entity.Material;
import com.buildsync.entity.OrderItems;
import com.buildsync.entity.OrderStatus;
import com.buildsync.entity.Orders;
import com.buildsync.entity.Site;
import com.buildsync.paging.PagingUtil;
import com.buildsync.repository.company.CompanyRepository;
import com.buildsync.repository.company.ContactRepository;
import com.buildsync.repository.material.SupStockRepository;
import com.buildsync.repository.order.OrderRepository;
import com.buildsync.repository.site.SiteRepository;
import com.buildsync.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final NotificationService notificationService;

	private final OrderRepository orderRepository;
	private final SiteRepository siteRepository;
	private final CompanyRepository companyRepository;
	private final ContactRepository contactRepository;
	private final SupStockRepository supStockRepository;
	
	// 발주서 작성 등록
	@Transactional
	public void registOrder(OrderRequest req) {

	    Company companyRef = Company.builder()
	            .id(req.getCompanyId())
	            .build();

	    Contact contactRef = Contact.builder()
	            .contactId(req.getContactId())
	            .build();
	    
	    Site siteRef = null;
        if (req.getSiteId() != null) {
            siteRef = Site.builder()
                    .id(req.getSiteId())
                    .build();
        }

	    Orders orders = Orders.builder()
	            .company(companyRef)
	            .contact(contactRef)
	            .site(siteRef)
	            .orderDate(java.sql.Date.valueOf(LocalDate.now()))
	            .status(OrderStatus.PENDING)
	            .memo(req.getMemo())
	            .build();

	    List<OrderItems> items = req.getItems().stream()
	            .map(dto -> {

	                Material materialRef = Material.builder()
	                        .id(dto.getMaterialId())
	                        .build();

	                return OrderItems.builder()
	                        .orders(orders)
	                        .material(materialRef)
	                        .unitPrice(dto.getUnitPrice())
	                        .quantity(dto.getQuantity())
	                        .amount(dto.getUnitPrice() * dto.getQuantity())
	                        .build();
	            })
	            .toList();

	    orders.modifyOrderDetails(req.getMemo(), items);

	    Orders saved = orderRepository.save(orders);

	    notificationService.sendNotification(
	            req.getCompanyId(),
	            "NEW_ORDER",
	            "신규 발주 요청 건",
	            "새로운 자재 발주서가 접수되었습니다.",
	            saved.getOrderId()
	    );
	}
	
	// 발주서 속 공급업체 목록
	@Transactional(readOnly = true)
	public List<Company> getSupplierList() {
		return companyRepository.findByCompanyType(CompanyType.SUPPLIER);
	}
	
	// 발주서 속 공급업체 담당자 자동 출력
	@Transactional(readOnly = true)
	public List<ContactResponse> getContactList(Long companyId) {
		List<Contact> contacts = contactRepository.findByCompany_Id(companyId);
		
		return contacts.stream()
				.map(c -> new ContactResponse(
						c.getContactId(),
						c.getContactName(),
						c.getDepartment(),
						c.getPosition(),
						c.getPhone(),
						c.getEmail()
				))
				.toList();
	}
	
	// 발주서 속 자재 목록
	@Transactional(readOnly = true)
	public List<MaterialSelectResponse> getMaterialsBySupplier(Long companyId) {
		return supStockRepository.findMaterialsBySupplierForSelect(companyId);
	}
	
	// 발주서 공사 현장
	@Transactional(readOnly = true)
    public List<SelectResponse> getSiteListForSelect() {
        return siteRepository.findAllForSelect();
    }
	
	// 건설업체 화면 발주 목록 (검색 + 상태 필터)
	@Transactional(readOnly = true)
    public PageResponse<OrderListResponse> getOrderListForConstruction(
            Long companyId, OrderStatus status, String keyword, Pageable pageable) {
        
        OrderStatus searchStatus = (status != null) ? status : null;
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword : null;
        
        List<Orders> totalList = orderRepository.searchOrdersForConstruction(companyId, searchStatus, searchKeyword);
        long totalElements = totalList.size();
        
        List<Orders> slicedList = PagingUtil.getSlicedList(totalList, pageable);
        
        List<OrderListResponse> dtoList = slicedList.stream()
                .map(order -> convertToOrderListResponse(order, "CONSTRUCTION"))
                .toList();
        
        return new PageResponse<>(dtoList, pageable, totalElements);
    }
	
	// 공급업체 화면 발주 목록 (검색 + 상태 필터)
	@Transactional(readOnly = true)
    public PageResponse<OrderListResponse> getOrderListForSupplier(
            Long companyId, OrderStatus status, String keyword, Pageable pageable) {
        
        OrderStatus searchStatus = (status != null) ? status : null;
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword : null;
        
        List<Orders> totalList = orderRepository.searchOrdersForSupplier(companyId, searchStatus, searchKeyword);
        long totalElements = totalList.size();
        
        List<Orders> slicedList = PagingUtil.getSlicedList(totalList, pageable);
        
        List<OrderListResponse> dtoList = slicedList.stream()
                .map(order -> convertToOrderListResponse(order, "SUPPLIER"))
                .toList();
        
        return new PageResponse<>(dtoList, pageable, totalElements);
    }
	
	// 발주서 상세 보기
    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetail(Long orderId) {

        Orders order = orderRepository.findByOrderDetail(orderId);
        
        if (order == null) {
            throw new IllegalArgumentException("존재하지 않는 발주서입니다. (ID: " + orderId + ")");
        }

        String managerName = "미지정";
        String cleanMemo = order.getMemo();
        if (cleanMemo != null && cleanMemo.contains("[담당자: ") && cleanMemo.contains("]")) {
            int start = cleanMemo.indexOf("[담당자: ") + 6;
            int end = cleanMemo.indexOf("]", start);
            managerName = cleanMemo.substring(start, end);
            cleanMemo = cleanMemo.substring(end + 1).trim();
        }
        
        String formattedSiteName = "";
        if (order.getSite() != null) {
            formattedSiteName = order.getSite().getSiteName() + "|" + (order.getSite().getAddress() != null ? order.getSite().getAddress() : "");
        }

        return OrderDetailResponse.builder()
                .orderId(order.getOrderId())
                
                .siteId(order.getSite() != null ? order.getSite().getId() : null)
                .siteName(formattedSiteName)
                
                .contactId(order.getContact() != null ? order.getContact().getContactId() : null)
                .contactName(order.getContact() != null ? order.getContact().getContactName() : "")
                .contactPhone(order.getContact() != null ? order.getContact().getPhone() : "")
                .contactEmail(order.getContact() != null ? order.getContact().getEmail() : "")
                
                .companyId(order.getContact() != null && order.getContact().getCompany() != null 
                        ? order.getContact().getCompany().getId() : null)
                .companyName(order.getContact() != null && order.getContact().getCompany() != null 
                        ? order.getContact().getCompany().getCompanyName() : "")
                
                .orderDate(order.getOrderDate() != null ? order.getOrderDate().toLocalDate() : null)
                .expectedDeliveryDate(order.getExpectedDeliveryDate() != null ? order.getExpectedDeliveryDate().toLocalDate() : null)
                
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                
                .memo(cleanMemo)
                .orderManagerName(managerName)

                .items(order.getItems().stream().map(item -> 
                    OrderDetailResponse.OrderItemDto.builder()
                            .materialId(item.getMaterial().getId())
                            .materialName(item.getMaterial().getMaterialName())
                            .specification(item.getMaterial().getSpecification())
                            .unit(item.getMaterial().getUnit())
                            .unitPrice(item.getUnitPrice())
                            .quantity(item.getQuantity())
                            .amount(item.getAmount())
                            .build()
                ).toList())
                
                .build();
    }
	
	// 건설업체 화면 상단 상태 카드
    @Transactional(readOnly = true)
    public OrderStatusResponse getStatusCountsForConstruction(Long companyId) {
        return orderRepository.countDashboardForConstruction(companyId);
    }
	
	// 공급업체 화면 상단 상태 카드
    @Transactional(readOnly = true)
    public OrderStatusResponse getStatusCountsForSupplier(Long companyId) {
        return orderRepository.countDashboardForSupplier(companyId);
    }
	
	// 건설업체 발주서 수정
    @Transactional
    public void modifyOrderByCompany(Long orderId, OrderRequest dto) {
        Orders order = orderRepository.findByOrderDetail(orderId);
        if (order == null) {
            throw new IllegalArgumentException("해당 발주서가 없습니다.");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("대기 중인 발주서만 수정하거나 취소할 수 있습니다.");
        }

        Long supplierCompanyId = (order.getContact() != null && order.getContact().getCompany() != null) 
                ? order.getContact().getCompany().getId() : null;
        
        String finalMemo = dto.getMemo();
        if (dto.getOrderManagerName() != null && !dto.getOrderManagerName().isBlank()) {
            finalMemo = "[담당자: " + dto.getOrderManagerName() + "]\n" + (dto.getMemo() != null ? dto.getMemo() : "");
        }

        List<OrderItems> newOrderItems = dto.getItems().stream()
                .map(itemDto -> {
                    Material materialRef = Material.builder()
                            .id(itemDto.getMaterialId())
                            .build();
                        
                    return OrderItems.builder()
                            .orders(order)
                            .material(materialRef)
                            .unitPrice(itemDto.getUnitPrice())
                            .quantity(itemDto.getQuantity())
                            .amount(itemDto.getUnitPrice() * itemDto.getQuantity()) // 수량 * 단가 자동 계산
                            .build();
                })
                .toList();
        
        order.modifyOrderDetails(finalMemo, newOrderItems);
        
        if (supplierCompanyId != null) {
            notificationService.sendNotification(
                    supplierCompanyId,
                    "ORDER_MODIFIED",
                    "발주서 수정 알림",
                    "대기 중인 발주서 #" + orderId + "의 상세 내용이 건설사에 의해 수정되었습니다.",
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
	    
        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 상태값입니다: " + status);
        }
	    
        order.changeStatus(orderStatus);
        
        Long constructionCompanyId = order.getConstructionCompanyId();
        if (constructionCompanyId == null) return;
        
        if (orderStatus == OrderStatus.ACCEPTED) {
            notificationService.sendNotification(
                    constructionCompanyId,
                    "ORDER_APPROVED",
                    "발주 수락 완료",
                    "공급업체에서 접수를 완료했습니다. 자재 배송을 준비합니다.",
                    orderId
            );
        } else if (orderStatus == OrderStatus.CANCELED) {
            notificationService.sendNotification(
                    constructionCompanyId,
                    "ORDER_REJECTED",
                    "발주 처리 취소 안내",
                    "공급업체 사정 혹은 요청에 의해 발주서 건이 취소(거절)되었습니다.",
                    orderId
            );
        } else if (orderStatus == OrderStatus.END) {
            notificationService.sendNotification(
                    constructionCompanyId,
                    "DELIVERY_START",
                    "자재 배송 완료 (출발)",
                    "발주하신 모든 자재의 출고 및 배송 준비가 완료되었습니다. 현장으로 출발합니다.",
                    orderId
            );
        }
    }
	
	private OrderListResponse convertToOrderListResponse(Orders order, String viewType) {

        String mainItemName = "품목 없음";
        int extraCount = 0;
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            mainItemName = order.getItems().get(0).getMaterial().getMaterialName();
            if (order.getItems().size() > 1) {
                extraCount = order.getItems().size() - 1;
            }
        }

        String managerName = "미지정";
        String cleanMemo = order.getMemo();
        if (cleanMemo != null && cleanMemo.contains("[담당자: ") && cleanMemo.contains("]")) {
            int start = cleanMemo.indexOf("[담당자: ") + 6;
            int end = cleanMemo.indexOf("]", start);
            managerName = cleanMemo.substring(start, end);
            cleanMemo = cleanMemo.substring(end + 1).trim(); 
        }

        String partnerName = "";
        String partnerType = "";
        
        if ("CONSTRUCTION".equals(viewType)) {
            if (order.getContact() != null && order.getContact().getCompany() != null) {
                partnerName = order.getContact().getCompany().getCompanyName();
            }
            partnerType = CompanyType.SUPPLIER.name();
        } else {
            if (order.getCompany() != null) {
                partnerName = order.getCompany().getCompanyName();
            }
            partnerType = CompanyType.CONSTRUCTION.name();
        }

        return OrderListResponse.builder()
                .orderId(order.getOrderId())
                .partnerName(partnerName)
                .partnerType(partnerType)
                .managerName(managerName)
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : "")
                .memo(cleanMemo)
                .mainItemName(mainItemName)
                .extraItemCount(extraCount)
                .build();
    }
}
