package com.yhm.gims.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.yhm.gims.domain.enumaration.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "paints")
public class Paint extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private CustomerCar customerCar;

    @NotNull
    @Column(name = "estimate_amount")
    private Float estimateAmount;


    @Column(name = "initial_payment_date")
    private LocalDate initialPaymentDate;



    @Column(name = "initial_payment_amount")
    private Float initialPayment;




    @Column(name = "final_payment_date")
    private LocalDate finalPaymentDate;



    @Column(name = "final_payment_amount")
    private Float finalPayment;




    @OneToMany(mappedBy = "paint", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<PaintLineItem> paints = new ArrayList<>();




    @NotNull
    @ManyToOne
    private PaymentCatalog paymentMethod;



    @Column(name = "pay_via_insurance")
    private Boolean payViaInsurance=false;



    private String insuranceName;


    @NotNull
    @Enumerated(EnumType.STRING)
    private Status status;



    public void addLineItem(PaintLineItem pli) {
        paints.add(pli);
        pli.setPaint(this);
    }

}
