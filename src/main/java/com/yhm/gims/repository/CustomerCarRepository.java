package com.yhm.gims.repository;

import com.yhm.gims.entity.CustomerCar;
import com.yhm.gims.entity.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerCarRepository extends JpaRepository<CustomerCar, Integer> {

}




