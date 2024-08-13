package com.yhm.gims.repository;

import com.yhm.gims.entity.Paint;
import com.yhm.gims.entity.Product;
import com.yhm.gims.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaintRepository extends JpaRepository<Paint, Integer>, JpaSpecificationExecutor<Paint> {


    @Query("SELECT s FROM Paint s WHERE MONTH(s.createdAt) = :month AND YEAR(s.createdAt) = :year")
    List<Paint> findByMonthAndYear(int month, int year);

}

