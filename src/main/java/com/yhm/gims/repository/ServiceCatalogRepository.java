package com.yhm.gims.repository;


import com.yhm.gims.entity.ServiceCatalog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Integer> {


    @Query("SELECT p FROM ServiceCatalog p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(p.cost AS string) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<ServiceCatalog> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}

