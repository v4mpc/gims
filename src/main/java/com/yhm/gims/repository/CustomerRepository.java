package com.yhm.gims.repository;

import com.yhm.gims.entity.Customer;
import com.yhm.gims.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("SELECT u FROM Customer u  JOIN u.cars c WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.make) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.model) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.plateNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.address) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Customer> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}




