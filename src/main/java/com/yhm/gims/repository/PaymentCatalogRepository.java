package com.yhm.gims.repository;

import com.yhm.gims.entity.PaymentCatalog;
import com.yhm.gims.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentCatalogRepository extends JpaRepository<PaymentCatalog, Integer> {

    @Query("SELECT u FROM PaymentCatalog u WHERE " +
            "LOWER(u.accountName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.accountNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<PaymentCatalog> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}




