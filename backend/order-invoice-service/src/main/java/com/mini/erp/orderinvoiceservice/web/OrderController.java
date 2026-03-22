package com.mini.erp.orderinvoiceservice.web;

import com.mini.erp.orderinvoiceservice.domain.Order;
import com.mini.erp.orderinvoiceservice.domain.OrderStatus;
import com.mini.erp.orderinvoiceservice.service.OrderService;
import com.mini.erp.orderinvoiceservice.web.dto.AddItemRequest;
import com.mini.erp.orderinvoiceservice.web.dto.CreateOrderRequest;
import com.mini.erp.orderinvoiceservice.web.dto.UpdateOrderStatusRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> list() {
        return orderService.list();
    }

    @GetMapping("/{id}")
    public Order get(@PathVariable Long id) {
        return orderService.get(id);
    }

    @PostMapping
    public Order create(@RequestBody CreateOrderRequest req) {
        return orderService.create(req.getCustomerId());
    }

    @PutMapping("/{id}")
    public Order updateStatus(@PathVariable Long id, @RequestBody UpdateOrderStatusRequest req) {
        return orderService.update(id, req.getStatus());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/items")
    public Order addItem(@PathVariable Long id, @RequestBody AddItemRequest req) {
        return orderService.addItem(id, req.getProductId(), req.getQuantity());
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    public Order removeItem(@PathVariable Long orderId, @PathVariable Long itemId) {
        return orderService.removeItem(orderId, itemId);
    }

    @GetMapping("/report")
    public Map<String, Object> reportOrders(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        java.math.BigDecimal total = orderService.totalBetween(from, to);
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("from", from);
        resp.put("to", to);
        resp.put("totalMontant", total);
        return resp;
    }
}
