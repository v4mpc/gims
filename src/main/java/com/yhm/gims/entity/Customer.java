package com.yhm.gims.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;


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

}
