package com.yhm.gims.repository;

import com.yhm.gims.entity.GService;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.YearMonth;
import java.util.List;

public interface ServiceRepository extends JpaRepository<GService, Integer>, JpaSpecificationExecutor<GService> {


    @Query("SELECT s FROM GService s WHERE MONTH(s.createdAt) = :month AND YEAR(s.createdAt) = :year")
    List<GService> findByMonthAndYear(int month, int year);


}

