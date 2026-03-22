package com.mini.erp.orderinvoiceservice.repository;

import com.mini.erp.orderinvoiceservice.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
