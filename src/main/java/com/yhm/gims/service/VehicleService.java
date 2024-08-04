package com.yhm.gims.service;


import com.yhm.gims.entity.Vehicle;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository vehicleRepository;


    public Page<Vehicle> findAll(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }


    public Page<Vehicle> getVehicles(String searchTerm, Pageable pageable) {

        if (searchTerm == null || searchTerm.isEmpty()) {
            return vehicleRepository.findAll(pageable);
        } else {
            return vehicleRepository.search(searchTerm, pageable);
        }

    }


    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    public void save(Vehicle vehicle) {
        for (Vehicle model : vehicle.getModels()) {
            model.setMake(vehicle);
        }
        vehicleRepository.save(vehicle);
    }

    public Vehicle update(Vehicle vehicle, int id) {
        Vehicle updateVehicle = vehicleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehicle not exist with id " + id));
        updateVehicle.setName(vehicle.getName());
        vehicleRepository.save(updateVehicle);
        return updateVehicle;
    }
}
