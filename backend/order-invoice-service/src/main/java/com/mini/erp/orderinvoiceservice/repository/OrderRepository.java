package com.mini.erp.orderinvoiceservice.repository;

import com.mini.erp.orderinvoiceservice.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select o from Order o where o.dateCommande between :from and :to")
    List<Order> findAllBetween(LocalDateTime from, LocalDateTime to);
}
