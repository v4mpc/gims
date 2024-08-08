package com.yhm.gims.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "paint_line_items")
public class PaintLineItem extends BaseEntity {



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paint_id")
    @JsonIgnore
    private Paint paint;

    @NotNull
    private String item;

    @NotNull
    private Float price;

    @NotNull
    private Integer quantity;

}
