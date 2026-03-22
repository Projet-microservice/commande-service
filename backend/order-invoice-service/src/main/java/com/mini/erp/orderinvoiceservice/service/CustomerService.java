package com.mini.erp.orderinvoiceservice.service;

import com.mini.erp.orderinvoiceservice.domain.Customer;
import com.mini.erp.orderinvoiceservice.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> list() {
        return customerRepository.findAll();
    }

    public Customer get(Long id) {
        return customerRepository.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Customer not found"));
    }

    public Customer create(Customer c) {
        c.setId(null);
        return customerRepository.save(c);
    }

    public Customer update(Long id, Customer c) {
        Customer existing = get(id);
        existing.setNom(c.getNom());
        existing.setEmail(c.getEmail());
        existing.setTelephone(c.getTelephone());
        existing.setAdresse(c.getAdresse());
        existing.setTenantId(c.getTenantId());
        return customerRepository.save(existing);
    }

    public void delete(Long id) {
        customerRepository.deleteById(id);
    }
}
