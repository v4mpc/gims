package com.yhm.gims.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "categories", schema = "public")
public class Category extends BaseEntity {


    @NotNull
    @Column(name = "name")
    private String name;

}