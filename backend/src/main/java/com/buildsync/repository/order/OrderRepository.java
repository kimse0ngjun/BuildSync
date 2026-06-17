package com.buildsync.repository.order;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.OrderStatus;
import com.buildsync.entity.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
	
	// 발주서 상세
	@Query("SELECT o FROM Orders o " +
	        "JOIN FETCH o.items " +
	        "WHERE o.orderId = :orderId")
	Orders findByOrderDetail(@Param ("orderId") Long orderId);
	
	// 건설
	long countByCompanyId(Long companyId);
	long countByCompanyIdAndStatus(Long companyId, OrderStatus status);
	
	// 공급
	long countByContact_Company_Id(Long companyId);
	long countByContact_Company_IdAndStatus(Long companyId, OrderStatus status);
	
	// 건설업체 발주 목록 (검색 + 상태 필터)
	@Query("SELECT DISTINCT o FROM Orders o " +
			"JOIN FETCH o.items i " +
			"JOIN FETCH i.material m " +
			"JOIN o.contact con " +
			"JOIN con.company supplier " +
			"WHERE o.company.id = :companyId " +
				"AND (:status IS NULL OR o.status = :status) " +
				"AND (:keyword IS NULL OR (o.memo LIKE %:keyword% OR supplier.companyName LIKE %:keyword% OR m.materialName LIKE %:keyword%)) " +
			"ORDER BY o.orderId DESC")
	    List<Orders> searchOrdersForConstruction(
	    		@Param("companyId") Long companyId, 
	    		@Param("status") OrderStatus status, 
	    		@Param("keyword") String keyword);

	// 공급업체 발주 목록 (검색 + 상태 필터)
	@Query("SELECT DISTINCT o FROM Orders o " +
			"JOIN FETCH o.items i " +
			"JOIN FETCH i.material m " +
	    		"JOIN o.company construction " +
	    		"WHERE o.contact.company.id = :companyId " +
	    			"AND (:status IS NULL OR o.status = :status) " +
	    			"AND (:keyword IS NULL OR (o.memo LIKE %:keyword% OR construction.companyName LIKE %:keyword% OR m.materialName LIKE %:keyword%)) " +
	    		"ORDER BY o.orderId DESC")
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
}
