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
@Table(name = "service_payments")
public class ServicePayments extends BaseEntity {


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    @JsonIgnore
    private GService service;


    @NotNull
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @NotNull
    @ManyToOne
    private PaymentCatalog paymentMethod;


    @Column(name = "pay_via_insurance")
    private Boolean payViaInsurance = false;


    private String insuranceName;

    @NotNull
    @Column(name = "amount")
    private Float amount;

}
