package com.mini.erp.orderinvoiceservice.domain;




import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table
        (name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    private LocalDateTime dateFacture;
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    private String tenantId;
}
