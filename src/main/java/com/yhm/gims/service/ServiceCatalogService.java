package com.yhm.gims.service;


import com.yhm.gims.entity.ServiceCatalog;
import com.yhm.gims.entity.ServiceCatalog;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.ServiceCatalogRepository;
import com.yhm.gims.repository.ServiceCatalogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService {

    private final ServiceCatalogRepository serviceCatalogRepository;


    public Page<ServiceCatalog> findAll(Pageable pageable) {
        return serviceCatalogRepository.findAll(pageable);
    }
    public List<ServiceCatalog> findAllNoPage() {
        return serviceCatalogRepository.findAll();
    }


    public Page<ServiceCatalog> getServiceCatalogs(String searchTerm, Pageable pageable) {

        if (searchTerm == null || searchTerm.isEmpty()) {
            return serviceCatalogRepository.findAll(pageable);
        } else {
            return serviceCatalogRepository.search(searchTerm, pageable);
        }

    }


    public List<ServiceCatalog> findAll() {
        return serviceCatalogRepository.findAll();
    }

    public void save(ServiceCatalog serviceCatalog) {
        serviceCatalogRepository.save(serviceCatalog);
    }

    public ServiceCatalog getServiceCatalog(int serviceCatalogId) {
        return serviceCatalogRepository.findById(serviceCatalogId).orElseThrow(() -> new ResourceNotFoundException("ServiceCatalog not exist with id " + serviceCatalogId));
    }


    public ServiceCatalog update(ServiceCatalog serviceCatalog, int id) {
        ServiceCatalog updateServiceCatalog = serviceCatalogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ServiceCatalog not exist with id " + id));
        updateServiceCatalog.setName(serviceCatalog.getName());
        updateServiceCatalog.setCost(serviceCatalog.getCost());
        serviceCatalogRepository.save(updateServiceCatalog);
        return updateServiceCatalog;
    }
}
