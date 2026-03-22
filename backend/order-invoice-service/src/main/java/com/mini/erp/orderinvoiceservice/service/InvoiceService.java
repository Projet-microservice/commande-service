package com.mini.erp.orderinvoiceservice.service;

import com.mini.erp.orderinvoiceservice.domain.Invoice;
import com.mini.erp.orderinvoiceservice.domain.InvoiceStatus;
import com.mini.erp.orderinvoiceservice.domain.Order;
import com.mini.erp.orderinvoiceservice.repository.InvoiceRepository;
import com.mini.erp.orderinvoiceservice.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, OrderRepository orderRepository) {
        this.invoiceRepository = invoiceRepository;
        this.orderRepository = orderRepository;
    }

    public List<Invoice> list() {
        return invoiceRepository.findAll();
    }

    public Invoice get(Long id) {
        return invoiceRepository.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Invoice not found"));
    }

    public void delete(Long id) {
        invoiceRepository.deleteById(id);
    }

    public Invoice generateFromOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new java.util.NoSuchElementException("Order not found"));
        return invoiceRepository.findByOrderId(orderId).orElseGet(() -> {
            Invoice invoice = Invoice.builder()
                    .order(order)
                    .dateFacture(LocalDateTime.now())
                    .montant(order.getTotalMontant() != null ? order.getTotalMontant() : BigDecimal.ZERO)
                    .status(InvoiceStatus.EN_ATTENTE)
                    .build();
            return invoiceRepository.save(invoice);
        });
    }

    public Invoice updateStatus(Long id, InvoiceStatus status) {
        Invoice invoice = get(id);
        invoice.setStatus(status);
        return invoiceRepository.save(invoice);
    }

    public BigDecimal totalByStatus(InvoiceStatus status) {
        BigDecimal sum = invoiceRepository.sumByStatus(status);
        return sum != null ? sum : BigDecimal.ZERO;
    }
}
