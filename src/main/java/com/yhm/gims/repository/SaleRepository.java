package com.yhm.gims.repository;

import com.yhm.gims.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

    Page<Sale> findByIsSale(boolean isSale, Pageable pageable);

    @Query("SELECT s FROM Sale s WHERE MONTH(s.createdAt) = :month AND YEAR(s.createdAt) = :year AND s.isSale=true")
    List<Sale> findByMonthAndYear(int month, int year);

}
