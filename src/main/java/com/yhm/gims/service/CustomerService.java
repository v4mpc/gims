package com.yhm.gims.service;


import com.yhm.gims.entity.Customer;
import com.yhm.gims.entity.Customer;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;


    public Page<Customer> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }


    public Page<Customer> getCustomers(String searchTerm, Pageable pageable) {

        if (searchTerm == null || searchTerm.isEmpty()) {
            return customerRepository.findAll(pageable);
        } else {
            return customerRepository.search(searchTerm, pageable);
        }

    }


    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public void save(Customer customer) {
        customerRepository.save(customer);
    }

    public Customer update(Customer customer, int id) {
        Customer updateCustomer = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not exist with id " + id));
        updateCustomer.setAddress(customer.getAddress());
        updateCustomer.setName(customer.getName());
        updateCustomer.setPhone(customer.getPhone());
        customerRepository.save(updateCustomer);
        return updateCustomer;
    }
}
