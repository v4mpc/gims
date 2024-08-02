package com.yhm.gims.controller;


import com.yhm.gims.entity.Product;
import com.yhm.gims.service.ProductService;
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
@RequestMapping(path = {"/api/products"})
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public Page<Product> getAllProducts(@RequestParam(value = "name", defaultValue = "%") String name, Pageable pageable) {

        return productService.findByName(name, pageable);
    }

    @PostMapping
    public ResponseEntity<Product> save(@Valid @RequestBody Product product) {
        productService.save(product);
        return ResponseEntity.ok(product);
    }

    @PutMapping("{id}")
    public ResponseEntity<Product> update(@PathVariable int id, @RequestBody Product product) {
        Product p = productService.update(product, id);
        return ResponseEntity.ok(p);
    }


    @GetMapping("/all")
    public List<Product> getAllProductsNoPagination() {
        return productService.findAllNoPage();
    }
}
