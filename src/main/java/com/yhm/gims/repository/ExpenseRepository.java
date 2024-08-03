package com.yhm.gims.repository;

import com.yhm.gims.entity.Expense;
import com.yhm.gims.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense,Integer> {
    @Query("SELECT s FROM Expense s WHERE MONTH(s.createdAt) = :month AND YEAR(s.createdAt) = :year")
    List<Expense> findByMonthAndYear(@Param("month") int month, @Param("year") int year);


    @Query("SELECT u FROM Expense u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(u.amount AS string) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Expense> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}
