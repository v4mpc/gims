package com.yhm.gims.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "paint_payments")
public class PaintPayments extends BaseEntity {


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paint_id")
    @JsonIgnore
    private Paint paint;


    @NotNull
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @NotNull
    @ManyToOne
    private PaymentCatalog paymentMethod;


    private String insuranceName;

    @NotNull
    @Column(name = "amount")
    private Float amount;

}
