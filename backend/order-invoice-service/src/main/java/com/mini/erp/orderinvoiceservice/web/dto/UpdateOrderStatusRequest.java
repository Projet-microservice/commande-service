package com.mini.erp.orderinvoiceservice.web.dto;

import com.mini.erp.orderinvoiceservice.domain.OrderStatus;

public class UpdateOrderStatusRequest {
    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
