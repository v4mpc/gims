package com.yhm.gims.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "customer_cars")
public class PaintLineItem extends BaseEntity {



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paint_id")
    private Paint paint;

    @NotNull
    private String item;

    @NotNull
    private Float price;

    @NotNull
    private Integer quantity;

}
