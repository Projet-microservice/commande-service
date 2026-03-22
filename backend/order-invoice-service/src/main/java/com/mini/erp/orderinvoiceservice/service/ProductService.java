package com.mini.erp.orderinvoiceservice.service;

import com.mini.erp.orderinvoiceservice.domain.Product;
import com.mini.erp.orderinvoiceservice.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> list() {
        return productRepository.findAll();
    }

    public Product get(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Product not found"));
    }

    public Product create(Product p) {
        p.setId(null);
        return productRepository.save(p);
    }

    public Product update(Long id, Product p) {
        Product existing = get(id);
        existing.setNom(p.getNom());
        existing.setPrix(p.getPrix());
        existing.setQuantiteDisponible(p.getQuantiteDisponible());
        existing.setCategorie(p.getCategorie());
        existing.setImageUrl(p.getImageUrl());
        existing.setTenantId(p.getTenantId());
        return productRepository.save(existing);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product save(Product p) {
        return productRepository.save(p);
    }

    public java.util.List<Product> search(String term, String categorie) {
        if ((term == null || term.isBlank()) && (categorie == null || categorie.isBlank())) {
            return list();
        }
        return productRepository.findByNomContainingIgnoreCaseOrCategorieContainingIgnoreCase(
                term != null ? term : "",
                categorie != null ? categorie : ""
        );
    }

    public Product reserveStock(Long id, int qty) {
        Product p = get(id);
        int stock = p.getQuantiteDisponible() != null ? p.getQuantiteDisponible() : 0;
        if (qty <= 0) return p;
        if (stock < qty) {
            throw new IllegalStateException("Stock insuffisant pour ce produit");
        }
        p.setQuantiteDisponible(stock - qty);
        return productRepository.save(p);
    }

    public Product releaseStock(Long id, int qty) {
        Product p = get(id);
        int stock = p.getQuantiteDisponible() != null ? p.getQuantiteDisponible() : 0;
        if (qty <= 0) return p;
        p.setQuantiteDisponible(stock + qty);
        return productRepository.save(p);
    }

    public void ensureStock(Long id, int qty) {
        Product p = get(id);
        int stock = p.getQuantiteDisponible() != null ? p.getQuantiteDisponible() : 0;
        if (qty <= 0) return;
        if (stock < qty) throw new IllegalStateException("Stock insuffisant");
    }
}
