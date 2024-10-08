package com.yhm.gims.controller;


import com.yhm.gims.dto.PaintDto;
import com.yhm.gims.dto.PaintDto;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.service.PaintService;
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
@RequestMapping(path = {"/api/paints"})
@RequiredArgsConstructor
public class PaintController {
    private final PaintService paintService;

    @GetMapping
    public Page<PaintDto> getPaints(@RequestParam(required = false) String q, Pageable pageable) {
        return paintService.getPaints(q, pageable);
    }

    @PostMapping
    public ResponseEntity<Paint> save(@Valid @RequestBody Paint paint) {
        paintService.save(paint);
        return ResponseEntity.ok(paint);
    }



    @PutMapping("{id}")
    public ResponseEntity<Paint> update(@PathVariable int id, @RequestBody Paint paint) {
        Paint p = paintService.update(paint, id);
        return ResponseEntity.ok(p);
    }


    @GetMapping("{id}")
    public ResponseEntity<PaintDto> get(@PathVariable int id) {
        PaintDto p = paintService.get(id);
        return ResponseEntity.ok(p);
    }



    @GetMapping("/all")
    public List<Paint> getAllPaintsNoPagination() {
        return paintService.findAllNoPage();
    }
}
