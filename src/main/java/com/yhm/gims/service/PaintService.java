package com.yhm.gims.service;


import com.yhm.gims.domain.PaintSpecs;
import com.yhm.gims.dto.PaintDto;
import com.yhm.gims.dto.PaintDto;
import com.yhm.gims.entity.*;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.CustomerCarRepository;
import com.yhm.gims.repository.PaintRepository;
import com.yhm.gims.repository.PaintRepository;
import com.yhm.gims.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaintService {

    private final PaintRepository paintRepository;
    private final VehicleRepository vehicleRepository;
    private final CustomerCarRepository customerCarRepository;


    public Page<Paint> findAll(Pageable pageable) {
        return paintRepository.findAll(pageable);
    }

    public List<Paint> findAllNoPage() {
        return paintRepository.findAll();
    }


    public PaintDto toPaintDto(Paint paint, String customerName, String customerPhone) {
        return PaintDto.builder()
                .paint(paint)
                .customerName(customerName)
                .customerPhone(customerPhone)
                .build();
    }


    public Page<PaintDto> getPaints(String searchTerm, Pageable pageable) {
        Page<Paint> paintsPage = paintRepository.findAll(Specification.anyOf(PaintSpecs.searchByCustomerName(searchTerm), PaintSpecs.searchByCustomerPhone(searchTerm), PaintSpecs.searchByCustomerMake(searchTerm), PaintSpecs.searchByCustomerModel(searchTerm), PaintSpecs.searchByCustomerPlateNumber(searchTerm)), pageable);
        List<Paint> paints = paintsPage.getContent();
        Pageable paintsPageable = paintsPage.getPageable();
        long paintsTotal = paintsPage.getTotalElements();
        List<PaintDto> paintsDto = paints.stream().map(p -> toPaintDto(p, p.getCustomerCar().getCustomer().getName(), p.getCustomerCar().getCustomer().getPhone())).toList();
        return new PageImpl<>(paintsDto, paintsPageable, paintsTotal);

    }


    public PaintDto get(Integer paintId) {
        Paint paint = paintRepository.findById(paintId).orElseThrow(() -> new ResourceNotFoundException("Paint not exist with id " + paintId));
        return toPaintDto(paint, paint.getCustomerCar().getCustomer().getName(),paint.getCustomerCar().getCustomer().getPhone());
    }


    @Transactional
    public void save(Paint paint) {
        for (PaintLineItem paintLineItem : paint.getPaints()) {
            paintLineItem.setPaint(paint);
        }
        paintRepository.save(paint);
    }


    public Paint update(Paint paint, int id) {
        Paint updatePaint = paintRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paint not exist with id " + id));
        updatePaint.setCustomerCar(paint.getCustomerCar());
        updatePaint.setEstimateAmount(paint.getEstimateAmount());
        updatePaint.setInitialPaymentDate(paint.getInitialPaymentDate());
        updatePaint.setInitialPayment(paint.getInitialPayment());
        updatePaint.setFinalPaymentDate(paint.getFinalPaymentDate());
        updatePaint.setFinalPayment(paint.getFinalPayment());
        updatePaint.setPaymentMethod(paint.getPaymentMethod());
        updatePaint.setPayViaInsurance(paint.getPayViaInsurance());
        updatePaint.setInsuranceName(paint.getInsuranceName());
        updatePaint.setStatus(paint.getStatus());
        updatePaint.getPaints().clear();
        for (PaintLineItem p : paint.getPaints()) {
            updatePaint.addLineItem(p);
        }
        paintRepository.save(updatePaint);
        return updatePaint;
    }


    public List<Paint> findAll() {
        return paintRepository.findAll();
    }


}
