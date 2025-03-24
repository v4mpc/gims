package com.yhm.gims.service;


import com.yhm.gims.domain.BaseInvoice;
import com.yhm.gims.domain.InvoiceFactory;
import com.yhm.gims.domain.InvoicePdf;
import com.yhm.gims.domain.PrintableReport;
import com.yhm.gims.domain.enumaration.InvoiceSource;
import com.yhm.gims.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceFactory invoiceFactory;

    public PrintableReport generateInvoice(InvoiceSource invoiceSource, Integer serviceId) throws Exception {
        BaseInvoice baseInvoice = invoiceFactory.createInvoice(invoiceSource, serviceId);
        InvoicePdf invoice = baseInvoice.generateInvoice();
        Map<String, Object> parameters = getStringObjectMap(invoice);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(invoice.getItems());
        ClassPathResource resource = new ClassPathResource("reports/auto_village.jasper");
        InputStream inputStream = resource.getInputStream();
        JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parameters, dataSource);
        String fileName = String.format("%s%s%s%s", invoice.getCustomerName(), "-", invoice.getInvoiceNumber(), ".pdf");

        return PrintableReport.builder()
                .dataBytes(JasperExportManager.exportReportToPdf(jasperPrint))
                .fileName(fileName)
                .build();
    }

    private static Map<String, Object> getStringObjectMap(InvoicePdf pdf) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("logoPath", "reports/av_logo.jpeg");
        parameters.put("pageTitle", "TAX INVOICE");
        parameters.put("total", pdf.getTotal());
        parameters.put("vat", pdf.getVat());
        parameters.put("subTotal", pdf.getSubTotal());
        parameters.put("billTo", "");
        parameters.put("customerName", pdf.getCustomerName());
        parameters.put("location", pdf.getAddress());
        parameters.put("invoiceNumber", pdf.getInvoiceNumber());
        parameters.put("invoiceDate", pdf.getInvoiceDate());
        return parameters;
    }
}
