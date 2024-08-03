package com.yhm.gims.controller;


import com.yhm.gims.entity.PaymentCatalog;
import com.yhm.gims.service.PaymentCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping(path = {"/api/paymentCatalog"})
@RequiredArgsConstructor
public class PaymentCatalogController {
    private final PaymentCatalogService paymentCatalogService;

    @GetMapping
    public Page<PaymentCatalog> getPaymentCatalogs(@RequestParam(required = false) String q, Pageable pageable) {
        return paymentCatalogService.getPaymentCatalogs(q, pageable);
    }


    @GetMapping("/all")
    public List<PaymentCatalog> getAllPaymentCatalogs() {
        return paymentCatalogService.findAll();
    }

    @PostMapping
    public ResponseEntity<PaymentCatalog> save(@Valid @RequestBody PaymentCatalog paymentCatalog) {

        paymentCatalogService.save(paymentCatalog);
        return ResponseEntity.ok(paymentCatalog);
    }

    @PutMapping("{id}")
    public ResponseEntity<PaymentCatalog> update(@PathVariable int id, @RequestBody PaymentCatalog paymentCatalog) {
        PaymentCatalog u = paymentCatalogService.update(paymentCatalog, id);
        return ResponseEntity.ok(u);
    }
}
