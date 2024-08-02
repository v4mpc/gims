package com.yhm.gims.repository;

import com.yhm.gims.entity.CustomReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomReportRepository extends JpaRepository<CustomReport, Integer> {


    Optional<CustomReport> findFirstByReportKey(String reportKey);





}
