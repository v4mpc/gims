package com.yhm.gims.repository;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    @Query("SELECT u FROM Vehicle u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Vehicle> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}




