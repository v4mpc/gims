package com.yhm.gims.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


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




    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },fetch = FetchType.EAGER)
    @JoinTable(
            name = "product_vehicle",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "vehicle_id")
    )
    private Set<Vehicle> vehicles = new HashSet<>();


    @NotNull
    @Column(name = "buy_price")
    private Float buyPrice;

    @NotNull
    @Column(name = "sale_price")
    private Float salePrice;

    @Column(name = "active")
    private Boolean active=true;

    @Column(name = "is_oil")
    private Boolean isOil=false;

}
