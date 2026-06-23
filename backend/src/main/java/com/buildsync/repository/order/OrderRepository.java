package com.buildsync.repository.order;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.dto.inout.SelectResponse;
import com.buildsync.dto.order.OrderStatusResponse;
import com.buildsync.entity.OrderStatus;
import com.buildsync.entity.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
	
	// 발주서 상세
	@Query("""
		    SELECT DISTINCT o FROM Orders o 
		    LEFT JOIN FETCH o.site
		    LEFT JOIN FETCH o.contact con
		    LEFT JOIN FETCH con.company
		    LEFT JOIN FETCH o.company
		    LEFT JOIN FETCH o.items i 
		    LEFT JOIN FETCH i.material 
		    WHERE o.orderId = :orderId
		""")
	Orders findByOrderDetail(@Param ("orderId") Long orderId);
	
	// 건설
	@Query("""
	        SELECT new com.buildsync.dto.order.OrderStatusResponse(
	            COUNT(o),
	            COUNT(CASE WHEN o.status = 'PENDING' THEN 1 END),
	            COUNT(CASE WHEN o.status = 'ACCEPTED' THEN 1 END),
	            COUNT(CASE WHEN o.status = 'END' THEN 1 END),
	            COUNT(CASE WHEN o.status = 'CANCELED' THEN 1 END)
	        )
	        FROM Orders o
	        WHERE o.company.id = :companyId
	    """)
	    OrderStatusResponse countDashboardForConstruction(@Param("companyId") Long companyId);
	
	// 공급
	@Query("""
		    SELECT new com.buildsync.dto.order.OrderStatusResponse(
		        COUNT(o),
		        SUM(CASE WHEN o.status = 'PENDING' THEN 1 ELSE 0 END),
		        SUM(CASE WHEN o.status = 'ACCEPTED' THEN 1 ELSE 0 END),
		        SUM(CASE WHEN o.status = 'END' THEN 1 ELSE 0 END),
		        SUM(CASE WHEN o.status = 'CANCELED' THEN 1 ELSE 0 END) 
		    )
		    FROM Orders o
		    JOIN o.contact c 
		    WHERE c.company.id = :companyId 
		""")
	    OrderStatusResponse countDashboardForSupplier(@Param("companyId") Long companyId);
	
	@Query("""
	        SELECT COUNT(DISTINCT o) FROM Orders o
	        JOIN o.items oi
	        JOIN SupMaterial sm ON oi.material.id = sm.material.id
	        WHERE sm.company.id = :companyId AND o.status = :status
	    """)
	    long countStatusBySupplier(@Param("companyId") Long companyId, @Param("status") OrderStatus status);
	
	// 건설업체 발주 목록 (검색 + 상태 필터)
	@Query("""
		    SELECT DISTINCT o FROM Orders o 
		    LEFT JOIN FETCH o.company construction 
		    LEFT JOIN FETCH o.contact con 
		    LEFT JOIN FETCH con.company supplier 
		    LEFT JOIN FETCH o.site s
		    LEFT JOIN FETCH o.items i 
		    LEFT JOIN FETCH i.material
		    WHERE o.company.id = :companyId 
		    AND (:status IS NULL OR o.status = :status) 
		    AND (:keyword IS NULL OR (
		        o.memo LIKE CONCAT('%', :keyword, '%') 
		        OR supplier.companyName LIKE CONCAT('%', :keyword, '%')
		        OR EXISTS (
		            SELECT oi FROM OrderItems oi 
		            WHERE oi.orders = o AND oi.material.materialName LIKE CONCAT('%', :keyword, '%')
		        )
		    )) 
		    ORDER BY o.orderId DESC
		""")
	    List<Orders> searchOrdersForConstruction(
	    		@Param("companyId") Long companyId, 
	    		@Param("status") OrderStatus status, 
	    		@Param("keyword") String keyword);

	// 공급업체 발주 목록 (검색 + 상태 필터)
	@Query("""
		    SELECT DISTINCT o FROM Orders o 
		    LEFT JOIN FETCH o.company construction 
		    LEFT JOIN FETCH o.contact con 
		    LEFT JOIN FETCH o.site s
		    LEFT JOIN FETCH o.items i 
		    LEFT JOIN FETCH i.material
		    WHERE o.contact.company.id = :companyId 
		    AND (:status IS NULL OR o.status = :status) 
		    AND (:keyword IS NULL OR (
		        o.memo LIKE CONCAT('%', :keyword, '%') 
		        OR construction.companyName LIKE CONCAT('%', :keyword, '%') 
		        OR EXISTS (
		            SELECT oi FROM OrderItems oi 
		            WHERE oi.orders = o AND oi.material.materialName LIKE CONCAT('%', :keyword, '%')
		        )
		    )) 
		    ORDER BY o.orderId DESC
		""")
	    List<Orders> searchOrdersForSupplier(
	    		@Param("companyId") Long companyId,
	    		@Param("status") OrderStatus status,
	    		@Param("keyword") String keyword);
	
	// 자재 조회
	@Query("""
		    SELECT o FROM Orders o
		    JOIN FETCH o.company c
		    WHERE o.company.id = :companyId
		      AND o.expectedDeliveryDate BETWEEN :firstDay AND :lastDay
		      AND o.status <> 'CANCELED'
		""")
        List<Orders> findDeliveriesByCompanyAndMonth(
            @Param("companyId") Long companyId,
            @Param("firstDay")  LocalDate firstDay,
            @Param("lastDay")   LocalDate lastDay
        );
	
	@Query("""
		    SELECT DISTINCT new com.buildsync.dto.inout.SelectResponse(
		        o.orderId,
		        CONCAT(o.orderId, ' (', cp.companyName, ')')
		    )
		    FROM Orders o
		    JOIN o.company cp  
		    JOIN o.contact c   
		    WHERE c.company.id = :companyId 
		    ORDER BY o.orderId DESC
		""")
		List<SelectResponse> findAllForSelect(@Param("companyId") Long companyId);
}
