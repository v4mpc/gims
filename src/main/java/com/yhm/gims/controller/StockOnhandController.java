package com.yhm.gims.controller;


import com.yhm.gims.dto.AdjustDto;
import com.yhm.gims.dto.StockOnhandDto;
import com.yhm.gims.service.StockOnhandService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping(path = {"/api/stock-on-hand"})
@RequiredArgsConstructor
public class StockOnhandController {
    private final StockOnhandService stockOnhandService;


    @GetMapping
    public Page<StockOnhandDto> getAll(@RequestParam(required = false) String q, @RequestParam(defaultValue = "ALL") String c, Pageable pageable) {
        return stockOnhandService.findAll(q, c, pageable);
    }


    @PutMapping
    public ResponseEntity<AdjustDto> adjustStockOnhand(@RequestBody AdjustDto adjustment) {
        stockOnhandService.update(adjustment.toStockEvent());
        return ResponseEntity.ok(adjustment);
    }


    @GetMapping("/all")
    public ResponseEntity<List<StockOnhandDto>> getNonZeroStockOnhand(@RequestParam(value = "nonZeroSoh", defaultValue = "false") boolean nonZeroSoh) {
        return ResponseEntity.ok(stockOnhandService.findAll(nonZeroSoh));
    }


}
