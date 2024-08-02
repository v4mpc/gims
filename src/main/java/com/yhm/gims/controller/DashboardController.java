package com.yhm.gims.controller;


import com.yhm.gims.dto.DashboardDto;
import com.yhm.gims.service.DashboardService;
import com.yhm.gims.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;

@RestController
@Validated
@RequestMapping(path = {"/api/dashboard"})
@RequiredArgsConstructor
public class DashboardController {

    public final DashboardService dashboardService;


    @GetMapping
    public ResponseEntity<DashboardDto> getMetrics(@RequestParam(required = false) String m) {
        YearMonth yearMonth = YearMonth.now();
        if (null != m && !m.isEmpty()) {
            yearMonth = DateUtil.fromString(m);
        }
        return ResponseEntity.ok(dashboardService.getMetrics(yearMonth));
    }
}
