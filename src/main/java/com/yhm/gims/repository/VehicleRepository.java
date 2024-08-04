package com.yhm.gims.repository;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Sale;
import com.yhm.gims.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    @Query("SELECT u FROM Vehicle u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Vehicle> search(@Param("searchTerm") String searchTerm, Pageable pageable);



    @Query("SELECT u FROM Vehicle u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND u.make IS NOT NULL")
    Page<Vehicle> searchModel(@Param("searchTerm") String searchTerm, Pageable pageable);



    @Query("SELECT u FROM Vehicle u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND u.make IS NULL")
    Page<Vehicle> searchMake(@Param("searchTerm") String searchTerm, Pageable pageable);



    Page<Vehicle> findByMakeIsNull(Pageable pageable);
    Page<Vehicle> findByMakeIsNotNull(Pageable pageable);



    List<Vehicle> findByMakeIsNull();
    List<Vehicle> findByMakeIsNotNull();
}




