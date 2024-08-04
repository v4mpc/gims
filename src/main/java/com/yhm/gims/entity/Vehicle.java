package com.yhm.gims.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Vehicle make;

    @OneToMany(mappedBy = "make")
    @JsonManagedReference
    private Set<Vehicle> models = new HashSet<>();





    public Vehicle(String name, Vehicle parent) {
        this.name = name;
        this.make = parent;
    }


    public void addModel(String modelName) {
        Vehicle model = new Vehicle();
        model.setName(modelName);
        this.models.add(model);
        model.setMake(this);
    }


    public void moveMake(Vehicle newMake) {
        this.getMake().getModels().remove(this);
        this.setMake(newMake);
        newMake.getModels().add(this);
    }

}