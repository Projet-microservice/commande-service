package com.mini.erp.orderinvoiceservice.web.dto;

import com.mini.erp.orderinvoiceservice.domain.InvoiceStatus;

public class UpdateInvoiceStatusRequest {
    private InvoiceStatus status;

    public InvoiceStatus getStatus() {
        return status;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }
}
