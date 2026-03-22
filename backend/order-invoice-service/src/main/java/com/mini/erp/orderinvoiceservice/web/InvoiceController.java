package com.mini.erp.orderinvoiceservice.web;

import com.mini.erp.orderinvoiceservice.domain.Invoice;
import com.mini.erp.orderinvoiceservice.domain.InvoiceStatus;
import com.mini.erp.orderinvoiceservice.service.InvoiceService;
import com.mini.erp.orderinvoiceservice.web.dto.UpdateInvoiceStatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public List<Invoice> list() {
        return invoiceService.list();
    }

    @GetMapping("/{id}")
    public Invoice get(@PathVariable Long id) {
        return invoiceService.get(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        invoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public Invoice generate(@RequestParam Long orderId) {
        return invoiceService.generateFromOrder(orderId);
    }

    @PutMapping("/{id}")
    public Invoice updateStatus(@PathVariable Long id, @RequestBody UpdateInvoiceStatusRequest req) {
        return invoiceService.updateStatus(id, req.getStatus());
    }

    @GetMapping("/report")
    public Map<String, BigDecimal> reportInvoices(@RequestParam InvoiceStatus status) {
        BigDecimal total = invoiceService.totalByStatus(status);
        java.util.Map<String, java.math.BigDecimal> resp = new java.util.HashMap<>();
        resp.put("total", total);
        return resp;
    }
}
