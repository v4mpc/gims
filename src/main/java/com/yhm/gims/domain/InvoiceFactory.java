package com.yhm.gims.domain;

import com.yhm.gims.domain.enumaration.InvoiceSource;
import com.yhm.gims.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class InvoiceFactory {

    private final ServiceRepository serviceRepository;

    public BaseInvoice createInvoice(InvoiceSource invoiceSource, Integer id) {
        if (InvoiceSource.GARAGE_SERVICE == invoiceSource) {
            return new GarageServiceInvoice(serviceRepository, id);
        } else {
            throw new RuntimeException("Unknown service source");
        }
    }
}
