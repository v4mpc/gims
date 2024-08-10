package com.yhm.gims.entity;


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
@Table(name = "services")
public class GService extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private CustomerCar customerCar;



    @Column(name = "initial_payment_date")
    private LocalDate initialPaymentDate;



    @Column(name = "initial_payment_amount")
    private Float initialPayment;




    @Column(name = "final_payment_date")
    private LocalDate finalPaymentDate;



    @Column(name = "final_payment_amount")
    private Float finalPayment;




    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<ServiceLineItem> services = new ArrayList<>();




    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<SpareLineItem> spares = new ArrayList<>();




    @NotNull
    @ManyToOne
    private PaymentCatalog paymentMethod;



    @Column(name = "pay_via_insurance")
    private Boolean payViaInsurance=false;



    private String insuranceName;


    @NotNull
    @Enumerated(EnumType.STRING)
    private Status status;



    public void addLineItem(ServiceLineItem sli) {
        services.add(sli);
        sli.setService(this);
    }


    public void addSpareLineItem(SpareLineItem sli) {
        spares.add(sli);
        sli.setService(this);
    }

}
