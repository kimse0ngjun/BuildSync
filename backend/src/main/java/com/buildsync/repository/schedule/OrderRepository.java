package com.buildsync.repository.schedule;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

// 자재 입고 추가
public interface OrderRepository /* extends JpaRepository<Orders, Long> */ {
//    @Query("""
//        SELECT o FROM Orders o
//        JOIN FETCH o.company c
//        WHERE o.company.id = :companyId
//          AND o.expectedDeliveryDate BETWEEN :firstDay AND :lastDay
//          AND o.status <> 'CANCELLED'
//    """)
//    List<Orders> findDeliveriesByCompanyAndMonth(
//        @Param("companyId") Long companyId,
//        @Param("firstDay")  LocalDate firstDay,
//        @Param("lastDay")   LocalDate lastDay
//    );
}