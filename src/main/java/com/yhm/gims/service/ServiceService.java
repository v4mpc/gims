package com.yhm.gims.service;


import com.yhm.gims.domain.ServiceSpecs;
import com.yhm.gims.dto.ServiceDto;
import com.yhm.gims.entity.GService;
import com.yhm.gims.entity.ServiceLineItem;
import com.yhm.gims.entity.SpareLineItem;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.CustomerCarRepository;
import com.yhm.gims.repository.ServiceRepository;
import com.yhm.gims.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;


    public Page<GService> findAll(Pageable pageable) {
        return serviceRepository.findAll(pageable);
    }

    public List<GService> findAllNoPage() {
        return serviceRepository.findAll();
    }


    public ServiceDto toServiceDto(GService service, String customerName, String customerPhone) {
        return ServiceDto.builder()
                .service(service)
                .customerName(customerName)
                .customerPhone(customerPhone)
                .build();
    }


    public Page<ServiceDto> getServices(String searchTerm, Pageable pageable) {

        Sort backendSort = Sort.by(Sort.Direction.DESC, "id");

        Pageable pageableWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), backendSort);
        Page<GService> servicesPage = serviceRepository.findAll(Specification.anyOf(ServiceSpecs.searchByCustomerName(searchTerm), ServiceSpecs.searchByCustomerPhone(searchTerm), ServiceSpecs.searchByCustomerMake(searchTerm), ServiceSpecs.searchByCustomerModel(searchTerm), ServiceSpecs.searchByCustomerPlateNumber(searchTerm)), pageableWithSort);
        List<GService> GServices = servicesPage.getContent();
        Pageable servicesPageable = servicesPage.getPageable();
        long servicesTotal = servicesPage.getTotalElements();
        List<ServiceDto> servicesDto = GServices.stream().map(p -> toServiceDto(p, p.getCustomerCar().getCustomer().getName(), p.getCustomerCar().getCustomer().getPhone())).toList();
        return new PageImpl<>(servicesDto, servicesPageable, servicesTotal);

    }


    public ServiceDto get(Integer serviceId) {
        GService service = serviceRepository.findById(serviceId).orElseThrow(() -> new ResourceNotFoundException("Service not exist with id " + serviceId));
        return toServiceDto(service, service.getCustomerCar().getCustomer().getName(), service.getCustomerCar().getCustomer().getPhone());
    }


    @Transactional
    public void save(GService service) {
        for (ServiceLineItem serviceLineItem : service.getServices()) {
            serviceLineItem.setService(service);
        }

        for (SpareLineItem spareLineItem : service.getSpares()) {
            spareLineItem.setService(service);
        }
        serviceRepository.save(service);
    }


    public GService update(GService GService, int id) {
        GService updateGService = serviceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not exist with id " + id));
        updateGService.setCustomerCar(GService.getCustomerCar());
        updateGService.setInitialPaymentDate(GService.getInitialPaymentDate());
        updateGService.setInitialPayment(GService.getInitialPayment());
        updateGService.setFinalPaymentDate(GService.getFinalPaymentDate());
        updateGService.setFinalPayment(GService.getFinalPayment());
        updateGService.setPaymentMethod(GService.getPaymentMethod());
        updateGService.setPayViaInsurance(GService.getPayViaInsurance());
        updateGService.setInsuranceName(GService.getInsuranceName());
        updateGService.setStatus(GService.getStatus());
        updateGService.getServices().clear();
        for (ServiceLineItem p : GService.getServices()) {
            updateGService.addLineItem(p);
        }
        updateGService.getSpares().clear();
        for (SpareLineItem p : GService.getSpares()) {
            updateGService.addSpareLineItem(p);
        }
        serviceRepository.save(updateGService);
        return updateGService;
    }


    public List<GService> findAll() {
        return serviceRepository.findAll();
    }


}
