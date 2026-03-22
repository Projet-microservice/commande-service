package com.mini.erp.orderinvoiceservice.repository;

import com.mini.erp.orderinvoiceservice.domain.Invoice;
import com.mini.erp.orderinvoiceservice.domain.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByOrderId(Long orderId);

    @Query("select sum(i.montant) from Invoice i where i.status = :status")
    java.math.BigDecimal sumByStatus(InvoiceStatus status);
}
