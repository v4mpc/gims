package com.yhm.gims.controller;


import com.yhm.gims.entity.ServiceCatalog;
import com.yhm.gims.service.ServiceCatalogService;
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
@RequestMapping(path = {"/api/serviceCatalogs"})
@RequiredArgsConstructor
public class ServiceCatalogController {
    private final ServiceCatalogService serviceCatalogService;

    @GetMapping
    public Page<ServiceCatalog> getServiceCatalogs(@RequestParam(required = false) String q, Pageable pageable) {
        return serviceCatalogService.getServiceCatalogs(q, pageable);
    }

    @PostMapping
    public ResponseEntity<ServiceCatalog> save(@Valid @RequestBody ServiceCatalog serviceCatalog) {
        serviceCatalogService.save(serviceCatalog);
        return ResponseEntity.ok(serviceCatalog);
    }

    @PutMapping("{id}")
    public ResponseEntity<ServiceCatalog> update(@PathVariable int id, @RequestBody ServiceCatalog serviceCatalog) {
        ServiceCatalog p = serviceCatalogService.update(serviceCatalog, id);
        return ResponseEntity.ok(p);
    }


    @GetMapping("/all")
    public List<ServiceCatalog> getAllServiceCatalogsNoPagination() {
        return serviceCatalogService.findAllNoPage();
    }
}
