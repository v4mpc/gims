package com.yhm.gims.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "paints")
public class Paint extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private CustomerCar customerCar;


    @Column(name = "estimate_amount")
    private Float estimateAmount = 0F;


    @OneToMany(mappedBy = "paint", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PaintLineItem> paints = new ArrayList<>();


    @OneToMany(mappedBy = "paint", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PaintPayments> payments = new ArrayList<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    private Status status;


    private Boolean includeEstimateAmount = true;


    public void addLineItem(PaintLineItem pli) {
        paints.add(pli);
        pli.setPaint(this);
    }


    public void addPayments(PaintPayments sp) {
        payments.add(sp);
        sp.setPaint(this);
    }


}
