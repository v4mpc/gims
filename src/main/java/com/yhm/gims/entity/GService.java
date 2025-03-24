package com.yhm.gims.entity;


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


    @Column(name = "initial_payment_date")
    private LocalDate initialPaymentDate;


    @Column(name = "initial_payment_amount")
    private Float initialPayment;


    @Column(name = "final_payment_date")
    private LocalDate finalPaymentDate;


    @Column(name = "final_payment_amount")
    private Float finalPayment;


    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ServiceLineItem> services = new ArrayList<>();


    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SpareLineItem> spares = new ArrayList<>();


    @NotNull
    @ManyToOne
    private PaymentCatalog paymentMethod;


    @Column(name = "pay_via_insurance")
    private Boolean payViaInsurance = false;


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


    public InvoicePdf generateInvoice() {
        List<InvoicePdfItem> items = new ArrayList<>();
        for (ServiceLineItem serviceLineItem : this.getServices()) {
            InvoicePdfItem invoicePdfItem = InvoicePdfItem.builder()
                    .description(serviceLineItem.getItem())
                    .price(serviceLineItem.getPrice())
                    .quantity(serviceLineItem.getQuantity().floatValue())
                    .build();
            items.add(invoicePdfItem);
        }


        for (SpareLineItem spareLineItem : this.getSpares()) {
            InvoicePdfItem invoicePdfItem = InvoicePdfItem.builder()
                    .description(spareLineItem.getItem())
                    .price(spareLineItem.getPrice())
                    .quantity(spareLineItem.getQuantity().floatValue())
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
