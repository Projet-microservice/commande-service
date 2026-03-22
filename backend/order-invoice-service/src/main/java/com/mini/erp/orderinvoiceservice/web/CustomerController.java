package com.mini.erp.orderinvoiceservice.web;

import com.mini.erp.orderinvoiceservice.domain.Customer;
import com.mini.erp.orderinvoiceservice.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> list() {
        return customerService.list();
    }

    @GetMapping("/{id}")
    public Customer get(@PathVariable Long id) {
        return customerService.get(id);
    }

    @PostMapping
    public Customer create(@RequestBody Customer c) {
        return customerService.create(c);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer c) {
        return customerService.update(id, c);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
