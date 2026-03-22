package com.mini.erp.orderinvoiceservice.repository;

import com.mini.erp.orderinvoiceservice.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
