package com.yhm.gims.repository;

import com.yhm.gims.entity.StockOnhand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface StockOnhandRepository extends JpaRepository<StockOnhand, Integer> {
    Optional<StockOnhand> findFirstByProductIdOrderByCreatedAtDesc(int productId);

    Optional<StockOnhand> findFirstByProductIdAndCreatedAtLessThanEqualOrderByCreatedAtDesc(int productId, LocalDate createdAt);
}
