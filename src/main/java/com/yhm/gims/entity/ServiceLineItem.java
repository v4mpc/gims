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
@Table(name = "service_line_items")
public class ServiceLineItem extends BaseEntity {



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    @JsonIgnore
    private GService GService;

    @NotNull
    private String item;

    @NotNull
    private Float price;

    @NotNull
    private Integer quantity;

}
