package com.mini.erp.orderinvoiceservice.web.dto;

public class CreateOrderRequest {
    private Long customerId;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
