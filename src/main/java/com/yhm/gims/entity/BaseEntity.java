package com.yhm.gims.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(value = {"updatedAt","CreatedAt"}, allowGetters = true)
public abstract class BaseEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;


    @PrePersist
    protected void onCreate() {
        setCreatedAt(LocalDate.now());
        setUpdatedAt(LocalDate.now());
    }


    @PreUpdate
    protected void onUpdate() {
        setUpdatedAt(LocalDate.now());
    }
}
