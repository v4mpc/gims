package com.yhm.gims.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "spare_line_items")
public class SpareLineItem extends BaseEntity {


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    @JsonIgnore
    private GService service;


    private Integer itemId;


    private String item;

    private String unit;


    private Float price;


    private Integer quantity;


    private Integer currentKm;

    private Integer nextKm;

}
