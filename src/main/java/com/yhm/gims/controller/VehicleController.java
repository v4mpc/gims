package com.yhm.gims.controller;


import com.yhm.gims.entity.Vehicle;
import com.yhm.gims.service.VehicleService;
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
@RequestMapping(path = {"/api/vehicles"})
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping
    public Page<Vehicle> getVehicles(@RequestParam(required = false) String q, Pageable pageable) {
        return vehicleService.getVehicles(q, pageable);
    }


    @GetMapping("/all")
    public List<Vehicle> getAllVehicles() {
        return vehicleService.findAll();
    }

    @PostMapping
    public ResponseEntity<Vehicle> save(@Valid @RequestBody Vehicle vehicle) {

        vehicleService.save(vehicle);
        return ResponseEntity.ok(vehicle);
    }

    @PutMapping("{id}")
    public ResponseEntity<Vehicle> update(@PathVariable int id, @RequestBody Vehicle vehicle) {
        Vehicle u = vehicleService.update(vehicle, id);
        return ResponseEntity.ok(u);
    }
}
