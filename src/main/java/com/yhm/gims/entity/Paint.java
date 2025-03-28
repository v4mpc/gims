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

    @NotNull
    @Column(name = "estimate_amount")
    private Float estimateAmount;


    @OneToMany(mappedBy = "paint", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PaintLineItem> paints = new ArrayList<>();


    @OneToMany(mappedBy = "paint", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PaintPayments> payments = new ArrayList<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    private Status status;


    private Boolean includeEstimateAmount;


    public void addLineItem(PaintLineItem pli) {
        paints.add(pli);
        pli.setPaint(this);
    }


    public void addPayments(PaintPayments sp) {
        payments.add(sp);
        sp.setPaint(this);
    }


    public InvoicePdf generateInvoice() {
        List<InvoicePdfItem> items = new ArrayList<>();
        for (PaintLineItem paintLineItem : this.getPaints()) {
            InvoicePdfItem invoicePdfItem = InvoicePdfItem.builder()
                    .description(paintLineItem.getItem())
                    .price(paintLineItem.getPrice())
                    .quantity(paintLineItem.getQuantity().floatValue())
                    .build();
            items.add(invoicePdfItem);
        }
        Date today = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        String formattedDate = formatter.format(today);

        return InvoicePdf.builder()
                .customerName(this.getCustomerCar().getCustomer().getName())
                .address(this.customerCar.getCustomer().getAddress())
                .invoiceDate(formattedDate)
                .percentageVatInDecimal(0F)
                .invoiceNumber("AV-INV-" + this.getId())
                .items(items)
                .subTotal(items.stream().map(InvoicePdfItem::getTotalPrice).reduce(0F, Float::sum))
                .build();
    }

}
