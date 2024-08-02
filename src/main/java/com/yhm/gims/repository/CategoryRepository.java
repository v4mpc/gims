package com.yhm.gims.repository;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT u FROM Unit u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Category> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}




