package com.yhm.gims.repository;

import com.yhm.gims.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findByNameContainingIgnoreCaseOrderByNameAsc(String name, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(p.salePrice AS string) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(p.buyPrice AS string) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Product> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}

