package com.yhm.gims.repository;

import com.yhm.gims.entity.GService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ServiceRepository extends JpaRepository<GService, Integer>, JpaSpecificationExecutor<GService> {


}

