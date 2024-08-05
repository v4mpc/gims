package com.yhm.gims.service;



import com.yhm.gims.entity.Customer;
import com.yhm.gims.entity.Customer;
import com.yhm.gims.entity.CustomerCar;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.CustomerCarRepository;
import com.yhm.gims.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerCarRepository customerCarRepository;


    public Page<Customer> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }
    public List<CustomerCar> findAllCars() {
        return customerCarRepository.findAll();
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


    @Transactional
    public void save(Customer customer) {
        for (CustomerCar car : customer.getCars()) {
            car.setCustomer(customer);
        }
        customerRepository.save(customer);

    }

    @Transactional
    public Customer update(Customer customer, int id) {
        Customer updateCustomer = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not exist with id " + id));
        updateCustomer.setAddress(customer.getAddress());
        updateCustomer.setName(customer.getName());
        updateCustomer.setPhone(customer.getPhone());
        updateCustomer.getCars().clear();
        for (CustomerCar car : customer.getCars()) {
            updateCustomer.addCar(car);
        }

        customerRepository.save(updateCustomer);
        return updateCustomer;
    }


}
