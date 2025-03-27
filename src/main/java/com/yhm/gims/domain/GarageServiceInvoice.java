package com.yhm.gims.domain;

import com.yhm.gims.domain.enumaration.Status;
import com.yhm.gims.entity.GService;
import com.yhm.gims.entity.ServiceLineItem;
import com.yhm.gims.entity.SpareLineItem;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
public class GarageServiceInvoice extends BaseInvoice {
    private final ServiceRepository serviceRepository;
    private final Integer id;

    public InvoicePdf generateInvoice() {
        GService service = serviceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not exist with id " + id));
        List<InvoicePdfItem> items = new ArrayList<>();
        for (ServiceLineItem serviceLineItem : service.getServices()) {
            InvoicePdfItem invoicePdfItem = InvoicePdfItem.builder()
                    .description(serviceLineItem.getItem())
                    .price(serviceLineItem.getPrice())
                    .quantity(serviceLineItem.getQuantity().floatValue())
                    .build();
            items.add(invoicePdfItem);
        }


        for (SpareLineItem spareLineItem : service.getSpares()) {
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

        String title = "PROFORMA INVOICE";
        if (service.getStatus().equals(Status.FINALIZED)) {
            title = "TAX INVOICE";
        }

        return InvoicePdf.builder()
                .customerName(service.getCustomerCar().getCustomer().getName())
                .address(service.getCustomerCar().getCustomer().getAddress())
                .title(title)
                .invoiceDate(formattedDate)
                .percentageVatInDecimal(0F)
                .invoiceNumber("AV-INV-" + service.getId())
                .items(items)
                .subTotal(items.stream().map(InvoicePdfItem::getTotalPrice).reduce(0F, Float::sum))
                .build();
    }


}
