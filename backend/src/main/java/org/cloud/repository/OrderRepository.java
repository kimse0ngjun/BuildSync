package org.cloud.repository;

import java.util.List;

import org.cloud.domain.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {

	// 발주서 목록
	@Query("SELECT DISTINCT o FROM orders o " +
	           "JOIN FETCH o.items " +
	           "WHERE o.companyId = :companyId " +
	           "ORDER BY o.orderDate DESC")
	List<Orders> findByConstructionOrders(@Param("companyId") Long companyId);

	    
	@Query("SELECT DISTINCT o FROM orders o " +
	           "JOIN FETCH o.items " +
	           "WHERE o.contactId = :contactId " +
	           "ORDER BY o.orderDate DESC")
	List<Orders> findByOrdersToSupplier(@Param("contactId") Long contactId);
	
	// 발주서 상세
	
}
