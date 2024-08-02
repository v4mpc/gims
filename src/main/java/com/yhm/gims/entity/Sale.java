package com.yhm.gims.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sales")
@Builder
public class Sale extends BaseEntity {


    @Column(name = "product_name", length = Integer.MAX_VALUE)
    private String productName;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;


    @NotNull
    @Column(name = "buy_price")
    private Float buyPrice;

    @NotNull
    @Column(name = "sale_price")
    private Float salePrice;


    @NotNull
    @Column(name = "quantity")
    private Float quantity;


    @NotNull
    @Column(name = "sale_adjustment")
    private Float saleAdjustment;

    @Column(name = "created_at")
    @JsonIgnore(value = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;


    @Column(name = "is_sale")
    private boolean isSale = true;

    @Override
    protected void onCreate() {
        setUpdatedAt(LocalDate.now());
    }


}
