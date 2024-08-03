package com.yhm.gims.service;


import com.yhm.gims.entity.PaymentCatalog;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.PaymentCatalogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentCatalogService {
    private final PaymentCatalogRepository paymentCatalogRepository;


    public Page<PaymentCatalog> findAll(Pageable pageable) {
        return paymentCatalogRepository.findAll(pageable);
    }


    public Page<PaymentCatalog> getPaymentCatalogs(String searchTerm, Pageable pageable) {

        if (searchTerm == null || searchTerm.isEmpty()) {
            return paymentCatalogRepository.findAll(pageable);
        } else {
            return paymentCatalogRepository.search(searchTerm, pageable);
        }

    }


    public List<PaymentCatalog> findAll() {
        return paymentCatalogRepository.findAll();
    }

    public void save(PaymentCatalog paymentCatalog) {
        paymentCatalogRepository.save(paymentCatalog);
    }

    public PaymentCatalog update(PaymentCatalog paymentCatalog, int id) {
        PaymentCatalog updatePaymentCatalog = paymentCatalogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PaymentCatalog not exist with id " + id));
        updatePaymentCatalog.setAccountName(paymentCatalog.getAccountName());
        updatePaymentCatalog.setAccountNumber(paymentCatalog.getAccountNumber());
        updatePaymentCatalog.setInsurance(paymentCatalog.getInsurance());
        paymentCatalogRepository.save(updatePaymentCatalog);
        return updatePaymentCatalog;
    }
}
