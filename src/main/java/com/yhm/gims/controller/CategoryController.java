package com.yhm.gims.controller;


import com.yhm.gims.entity.Category;
import com.yhm.gims.service.CategoryService;
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
@RequestMapping(path = {"/api/categories"})
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public Page<Category> getCategories(@RequestParam(required = false) String q, Pageable pageable) {
        return categoryService.getCategories(q, pageable);
    }


    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryService.findAll();
    }

    @PostMapping
    public ResponseEntity<Category> save(@Valid @RequestBody Category category) {

        categoryService.save(category);
        return ResponseEntity.ok(category);
    }

    @PutMapping("{id}")
    public ResponseEntity<Category> update(@PathVariable int id, @RequestBody Category category) {
        Category u = categoryService.update(category, id);
        return ResponseEntity.ok(u);
    }
}
