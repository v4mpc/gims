package com.yhm.gims.service;


import com.yhm.gims.domain.InvoicePdf;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class InvoiceService {

    public byte[] generateInvoice(InvoicePdf pdf) throws Exception {
        Map<String, Object> parameters = getStringObjectMap(pdf);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(pdf.getItems());
        ClassPathResource resource = new ClassPathResource("reports/auto_village.jasper");
        InputStream inputStream = resource.getInputStream();
        JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parameters, dataSource);
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    private static Map<String, Object> getStringObjectMap(InvoicePdf pdf) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("logoPath", "reports/av_logo.jpeg");
        parameters.put("pageTitle", "TAX INVOICE");
        parameters.put("total", pdf.getTotal());
        parameters.put("vat", pdf.getVat());
        parameters.put("subTotal", pdf.getSubTotal());
        parameters.put("billTo", "");
        parameters.put("customerName", "EUGENE");
        parameters.put("location", "DAR ES SALAAM");
        parameters.put("invoiceNumber", "014");
        parameters.put("invoiceDate", "07/09/2023");
        return parameters;
    }
}
