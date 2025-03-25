package com.yhm.gims.entity;


import com.yhm.gims.domain.Invoicable;
import com.yhm.gims.domain.InvoicePdf;
import com.yhm.gims.domain.InvoicePdfItem;
import com.yhm.gims.domain.enumaration.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
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


    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ServiceLineItem> services = new ArrayList<>();


    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SpareLineItem> spares = new ArrayList<>();


    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ServicePayments> payments = new ArrayList<>();


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


    public void addPayments(ServicePayments sp) {
        payments.add(sp);
        sp.setService(this);
    }


}
