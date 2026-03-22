package com.mini.erp.orderinvoiceservice.service;

import com.mini.erp.orderinvoiceservice.domain.*;
import com.mini.erp.orderinvoiceservice.repository.OrderItemRepository;
import com.mini.erp.orderinvoiceservice.repository.OrderRepository;
import com.mini.erp.orderinvoiceservice.repository.ProductRepository;
import com.mini.erp.orderinvoiceservice.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository,
                        CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    public List<Order> list() {
        return orderRepository.findAll();
    }

    public Order get(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Order not found"));
    }

    public Order create(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new java.util.NoSuchElementException("Customer not found"));
        Order order = Order.builder()
                .customer(customer)
                .dateCommande(LocalDateTime.now())
                .status(OrderStatus.EN_COURS)
                .totalMontant(BigDecimal.ZERO)
                .build();
        return orderRepository.save(order);
    }

    public Order update(Long id, OrderStatus status) {
        Order order = get(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    public Order addItem(Long orderId, Long productId, Integer quantity) {
        Order order = get(orderId);
        Product product = productRepository.findById(productId).orElseThrow(() -> new java.util.NoSuchElementException("Product not found"));
        int stock = product.getQuantiteDisponible() != null ? product.getQuantiteDisponible() : 0;
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantité invalide");
        }
        if (stock < quantity) {
            throw new IllegalStateException("Stock insuffisant pour ce produit");
        }
        BigDecimal unitPrice = product.getPrix();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .lineTotal(lineTotal)
                .build();
        orderItemRepository.save(item);
        order.getItems().add(item);
        // decrement stock
        product.setQuantiteDisponible(stock - quantity);
        productRepository.save(product);
        recalcTotal(order);
        return orderRepository.save(order);
    }

    public Order removeItem(Long orderId, Long itemId) {
        Order order = get(orderId);
        OrderItem item = order.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst()
                .orElse(null);
        if (item != null) {
            // restore stock
            Product p = item.getProduct();
            int stock = p.getQuantiteDisponible() != null ? p.getQuantiteDisponible() : 0;
            p.setQuantiteDisponible(stock + (item.getQuantity() != null ? item.getQuantity() : 0));
            productRepository.save(p);
            order.getItems().remove(item);
            orderItemRepository.deleteById(itemId);
        }
        recalcTotal(order);
        return orderRepository.save(order);
    }

    public java.math.BigDecimal totalBetween(LocalDateTime from, LocalDateTime to) {
        return orderRepository.findAllBetween(from, to).stream()
                .map(Order::getTotalMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private void recalcTotal(Order order) {
        BigDecimal total = order.getItems().stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalMontant(total);
    }
}
