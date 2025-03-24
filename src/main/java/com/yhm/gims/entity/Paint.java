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
public class Paint extends BaseEntity  {

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


    @OneToMany(mappedBy = "paint", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PaintLineItem> paints = new ArrayList<>();


    @NotNull
    @ManyToOne
    private PaymentCatalog paymentMethod;


    @Column(name = "pay_via_insurance")
    private Boolean payViaInsurance = false;


    private String insuranceName;


    @NotNull
    @Enumerated(EnumType.STRING)
    private Status status;


    public void addLineItem(PaintLineItem pli) {
        paints.add(pli);
        pli.setPaint(this);
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
