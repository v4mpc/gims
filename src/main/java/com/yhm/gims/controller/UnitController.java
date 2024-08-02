package com.yhm.gims.controller;


import com.yhm.gims.entity.Unit;
import com.yhm.gims.service.UnitService;
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
@RequestMapping(path = {"/api/units"})
@RequiredArgsConstructor
public class UnitController {
    private final UnitService unitService;

    @GetMapping
    public Page<Unit> getAllUnits(Pageable pageable) {
        return unitService.findAll(pageable);
    }


    @GetMapping("/all")
    public List<Unit> getAllUnits() {
        return unitService.findAll();
    }

    @PostMapping
    public ResponseEntity<Unit> save(@Valid @RequestBody Unit unit) {

        unitService.save(unit);
        return ResponseEntity.ok(unit);
    }

    @PutMapping("{id}")
    public ResponseEntity<Unit> update(@PathVariable int id, @RequestBody Unit unit) {
        Unit u = unitService.update(unit, id);
        return ResponseEntity.ok(u);
    }
}
