package com.yhm.gims.service;


import com.yhm.gims.domain.PaintSpecs;
import com.yhm.gims.dto.PaintDto;
import com.yhm.gims.dto.ProductDto;
import com.yhm.gims.entity.*;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.CustomerCarRepository;
import com.yhm.gims.repository.PaintRepository;
import com.yhm.gims.repository.PaintRepository;
import com.yhm.gims.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


    public Page<Paint> getPaints(String searchTerm, Pageable pageable) {
        return paintRepository.findAll(Specification.anyOf(PaintSpecs.searchByCustomerName(searchTerm), PaintSpecs.searchByCustomerPhone(searchTerm), PaintSpecs.searchByCustomerMake(searchTerm), PaintSpecs.searchByCustomerModel(searchTerm), PaintSpecs.searchByCustomerPlateNumber(searchTerm)), pageable);
    }



    @Transactional
    public void save(Paint paint) {


        for (PaintLineItem paintLineItem : paint.getPaints()) {
            paintLineItem.setPaint(paint);
        }
        paintRepository.save(paint);
    }


    public List<Paint> findAll() {
        return paintRepository.findAll();
    }


}
