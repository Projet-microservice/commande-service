package com.mini.erp.orderinvoiceservice.web;

import com.mini.erp.orderinvoiceservice.domain.Product;
import com.mini.erp.orderinvoiceservice.service.ProductService;
import com.mini.erp.orderinvoiceservice.service.ImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.nio.file.*;
import java.io.IOException;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;
    private final ImageService imageService;
    @Value("${mini.erp.upload-dir:uploads}")
    private String uploadDir;

    public ProductController(ProductService productService, ImageService imageService) {
        this.productService = productService;
        this.imageService = imageService;
    }

    @GetMapping
    public List<Product> list() {
        return productService.list();
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) {
        return productService.get(id);
    }

    @PostMapping
    public Product create(@RequestBody Product p) {
        return productService.create(p);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product p) {
        return productService.update(id, p);
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam(required = false) String term, @RequestParam(required = false) String categorie) {
        return productService.search(term, categorie);
    }

    @PostMapping(value = {"/{id}/image", "/api/products/{id}/image"})
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        String fileName = imageService.save(file);
        product.setImageUrl("/uploads/" + fileName);
        productService.save(product);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/available")
    public ResponseEntity<Void> checkAvailable(@PathVariable Long id, @RequestParam int qty) {
        productService.ensureStock(id, qty);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reserve")
    public Product reserve(@PathVariable Long id, @RequestParam int qty) {
        return productService.reserveStock(id, qty);
    }

    @PostMapping("/{id}/release")
    public Product release(@PathVariable Long id, @RequestParam int qty) {
        return productService.releaseStock(id, qty);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
