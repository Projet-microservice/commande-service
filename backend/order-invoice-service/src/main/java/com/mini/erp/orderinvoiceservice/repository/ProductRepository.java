package com.mini.erp.orderinvoiceservice.repository;

import com.mini.erp.orderinvoiceservice.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    java.util.List<Product> findByNomContainingIgnoreCaseOrCategorieContainingIgnoreCase(String nom, String categorie);
}
