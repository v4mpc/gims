package com.yhm.gims.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "products")
public class Product extends BaseEntity {


    @NotNull
    private String code;

    @NotNull
    private String name;



    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;


    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "unit_of_measure_id")
    private Unit unitOfMeasure;



    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @NotNull
    @Column(name = "buy_price")
    private Float buyPrice;

    @NotNull
    @Column(name = "sale_price")
    private Float salePrice;

    @NotNull
    @Column(name = "active")
    private Boolean active;

}
