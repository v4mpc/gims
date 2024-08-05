package com.yhm.gims.controller;


import com.yhm.gims.entity.Customer;
import com.yhm.gims.entity.CustomerCar;
import com.yhm.gims.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping(path = {"/api/customers"})
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public Page<Customer> getCustomers(@RequestParam(required = false) String q, Pageable pageable) {
        return customerService.getCustomers(q, pageable);
    }


    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return customerService.findAll();
    }


    @GetMapping("/cars")
    public List<CustomerCar> getAllCustomerCars() {
        return customerService.findAllCars();
    }

    @PostMapping
    public ResponseEntity<Customer> save(@Valid @RequestBody Customer customer) {

        customerService.save(customer);
        return ResponseEntity.ok(customer);
    }

    @PutMapping("{id}")
    public ResponseEntity<Customer> update(@PathVariable int id, @RequestBody Customer customer) {
        Customer u = customerService.update(customer, id);
        return ResponseEntity.ok(u);
    }
}
