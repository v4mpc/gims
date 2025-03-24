package com.yhm.gims.domain;

import com.yhm.gims.entity.*;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.PaintRepository;
import com.yhm.gims.repository.ServiceRepository;
import com.yhm.gims.service.PaintService;
import lombok.RequiredArgsConstructor;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
public class PaintInvoice extends BaseInvoice {
    private final PaintRepository paintRepository;
    private final Integer id;

    public InvoicePdf generateInvoice() {
        Paint paint = paintRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not exist with id " + id));
        List<InvoicePdfItem> items = new ArrayList<>();
        for (PaintLineItem paintLineItem : paint.getPaints()) {
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
                .customerName(paint.getCustomerCar().getCustomer().getName())
                .address(paint.getCustomerCar().getCustomer().getAddress())
                .invoiceDate(formattedDate)
                .percentageVatInDecimal(0F)
                .invoiceNumber("AV-INV-" + paint.getId())
                .items(items)
                .subTotal(items.stream().map(InvoicePdfItem::getTotalPrice).reduce(0F, Float::sum))
                .build();
    }


}
