package com.mini.erp.orderinvoiceservice.domain;


import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private BigDecimal prix;
    private Integer quantiteDisponible;
    private String categorie;
    private String imageUrl;

    private String tenantId;
}
