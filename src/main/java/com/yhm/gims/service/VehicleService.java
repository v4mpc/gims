package com.yhm.gims.service;


import com.yhm.gims.dto.VehicleDto;
import com.yhm.gims.entity.Vehicle;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository vehicleRepository;


    public Page<Vehicle> findAll(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }


    public Page<Vehicle> getVehicles(String searchTerm, Boolean make, Pageable pageable) {

        if (searchTerm == null || searchTerm.isEmpty()) {
            if (make) {
                return vehicleRepository.findByMakeIsNull(pageable);
            }
            return vehicleRepository.findByMakeIsNotNull(pageable);
        } else {
            if (make) {
                return vehicleRepository.searchMake(searchTerm, pageable);
            }
            return vehicleRepository.searchModel(searchTerm, pageable);
        }

    }


    public List<Vehicle> findAll(Boolean make) {

        if (make) {
            return vehicleRepository.findByMakeIsNull();
        }
        return vehicleRepository.findByMakeIsNotNull();
    }

    public void save(VehicleDto vehicleDto) {


        if (vehicleDto.getModels() == null) {
            vehicleRepository.save(new Vehicle(vehicleDto.getMake(), null));
        } else {
            Vehicle updateVehicle = vehicleRepository.findById(Integer.parseInt(vehicleDto.getMake())).orElseThrow(() -> new ResourceNotFoundException("Vehicle not exist with id " + Integer.parseInt(vehicleDto.getMake())));

            for (HashMap<String, String> model : vehicleDto.getModels()) {
                vehicleRepository.save(new Vehicle(model.get("name"), updateVehicle));
            }
        }


    }

    public Vehicle update(Vehicle vehicle, int id) {
        Vehicle updateVehicle = vehicleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehicle not exist with id " + id));
        updateVehicle.setName(vehicle.getName());
        vehicleRepository.save(updateVehicle);
        return updateVehicle;
    }
}
