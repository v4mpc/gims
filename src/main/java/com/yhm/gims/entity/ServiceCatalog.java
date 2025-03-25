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
@Table(name = "service_catalog")
public class ServiceCatalog extends BaseEntity {

    @NotNull
    @Column(unique = true)
    private String name;

    @NotNull
    private Float cost;

}
