package com.yhm.gims.controller;


import com.yhm.gims.dto.ReportFilterRequest;
import com.yhm.gims.entity.CustomReport;
import com.yhm.gims.service.CustomReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@Validated
@RequestMapping(path = {"/api/custom-report"})
@RequiredArgsConstructor
public class CustomReportController {
    private final CustomReportService customReportService;

    @GetMapping("")
    public List<CustomReport> getAllReports() {
        return customReportService.findAll();
    }


    @PostMapping("fetch-report")
    public List<Map<String, Object>> fetchReportData(@RequestBody ReportFilterRequest reportFilterRequest) {
        return customReportService.fetchData(reportFilterRequest);
    }

    @PostMapping
    public ResponseEntity<CustomReport> save(@Valid @RequestBody CustomReport customReport) {

        customReportService.save(customReport);
        return ResponseEntity.ok(customReport);
    }

    @PutMapping("{id}")
    public ResponseEntity<CustomReport> update(@PathVariable int id, @RequestBody CustomReport customReport) {
        CustomReport c = customReportService.update(customReport, id);
        return ResponseEntity.ok(c);
    }

}
