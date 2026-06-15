package com.buildsync.repository.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buildsync.entity.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {

	// 발주서 목록
	@Query("SELECT DISTINCT o FROM Orders o " +
			"JOIN FETCH o.items " +
			"WHERE o.company.id = :companyId " +
			"ORDER BY o.orderDate DESC")
	List<Orders> findByConstructionOrders(@Param("companyId") Long companyId);

	    
	@Query("SELECT DISTINCT o FROM Orders o " +
	        "JOIN FETCH o.items " +
	        "WHERE o.contact.company.id = :companyId " +
	        "ORDER BY o.orderDate DESC")
	List<Orders> findByOrdersToSupplier(@Param("companyId") Long companyId);
	
	// 발주서 상세
	@Query("SELECT o FROM Orders o " +
	        "JOIN FETCH o.items " +
	        "WHERE o.orderId = :orderId")
	Orders findByOrderDetail(@Param ("orderId") Long orderId);
}
