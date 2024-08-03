package com.yhm.gims.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "customers")
public class Customer extends BaseEntity {

    @NotNull
    private String name;

    @NotNull
    private String phone;

    private String address;

    @NotNull
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference

    private List<CustomerCar> cars = new ArrayList<>();



    public void addCar(CustomerCar car) {
        cars.add(car);
        car.setCustomer(this);
    }

}
