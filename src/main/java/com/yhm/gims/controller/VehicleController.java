package com.yhm.gims.controller;


import com.yhm.gims.dto.VehicleDto;
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
    public Page<Vehicle> getVehicles(@RequestParam(required = false) String q, @RequestParam(defaultValue = "true") Boolean make, Pageable pageable) {
        return vehicleService.getVehicles(q, make, pageable);
    }


    @GetMapping("/all")
    public List<Vehicle> getAllVehicles(@RequestParam(defaultValue = "true") Boolean make) {
        return vehicleService.findAll(make);
    }

    @PostMapping
    public ResponseEntity<VehicleDto> save(@Valid @RequestBody VehicleDto vehicleDto) {

        vehicleService.save(vehicleDto);
        return ResponseEntity.ok(vehicleDto);
    }

    @PutMapping("{id}")
    public ResponseEntity<Vehicle> update(@PathVariable int id, @RequestBody Vehicle vehicle) {
        Vehicle u = vehicleService.update(vehicle, id);
        return ResponseEntity.ok(u);
    }
}
