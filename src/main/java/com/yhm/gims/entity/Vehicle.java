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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicles", schema = "public")
public class Vehicle extends BaseEntity {


    @NotNull
    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private Vehicle make;

    @OneToMany(mappedBy = "make")
    @JsonManagedReference
    private Set<Vehicle> models = new HashSet<>();


    @JsonIgnore
    @ManyToMany(mappedBy = "vehicles", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private Set<Product> products = new HashSet<>();



    public Vehicle(String name, Vehicle parent) {
        this.name = name;
        this.make = parent;
    }


}