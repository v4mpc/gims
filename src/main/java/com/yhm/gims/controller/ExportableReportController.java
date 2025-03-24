package com.yhm.gims.controller;


import com.yhm.gims.domain.InvoicePdf;
import com.yhm.gims.domain.InvoicePdfItem;
import com.yhm.gims.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;

import java.util.Arrays;
import java.util.List;

@RestController
@Validated
@RequestMapping(path = {"/api/export"})
@RequiredArgsConstructor
public class ExportableReportController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("invoice/{id}")
    public ResponseEntity<byte[]> generateInvoice(@PathVariable int id) throws Exception {
        byte[] pdfBytes = invoiceService.generateInvoice(id);
        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "invoice.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
