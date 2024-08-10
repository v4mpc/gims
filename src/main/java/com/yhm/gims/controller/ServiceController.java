package com.yhm.gims.controller;


import com.yhm.gims.dto.ServiceDto;
import com.yhm.gims.entity.GService;
import com.yhm.gims.service.ServiceService;
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
@RequestMapping(path = {"/api/services"})
@RequiredArgsConstructor
public class ServiceController {
    private final ServiceService serviceService;

    @GetMapping
    public Page<ServiceDto> getServices(@RequestParam(required = false) String q, Pageable pageable) {
        return serviceService.getServices(q, pageable);
    }

    @PostMapping
    public ResponseEntity<GService> save(@Valid @RequestBody GService service) {
        serviceService.save(service);
        return ResponseEntity.ok(service);
    }



    @PutMapping("{id}")
    public ResponseEntity<GService> update(@PathVariable int id, @RequestBody GService service) {
        GService p = serviceService.update(service, id);
        return ResponseEntity.ok(p);
    }


    @GetMapping("{id}")
    public ResponseEntity<ServiceDto> get(@PathVariable int id) {
        ServiceDto p = serviceService.get(id);
        return ResponseEntity.ok(p);
    }



    @GetMapping("/all")
    public List<GService> getAllServicesNoPagination() {
        return serviceService.findAllNoPage();
    }
}
