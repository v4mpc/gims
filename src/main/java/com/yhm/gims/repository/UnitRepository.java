package com.yhm.gims.repository;

import com.yhm.gims.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnitRepository extends JpaRepository<Unit, Integer> {

    @Query("SELECT u FROM Unit u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Unit> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}




