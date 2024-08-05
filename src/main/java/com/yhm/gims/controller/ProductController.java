package com.yhm.gims.controller;


import com.yhm.gims.dto.ProductDto;
import com.yhm.gims.entity.Category;
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
    public Page<Product> getProducts(@RequestParam(required = false) String q, Pageable pageable) {
        return productService.getProducts(q, pageable);
    }

    @PostMapping
    public ResponseEntity<ProductDto> save(@Valid @RequestBody ProductDto productDto) {
        productService.save(productDto);
        return ResponseEntity.ok(productDto);
    }

    @PutMapping("{id}")
    public ResponseEntity<Product> update(@PathVariable int id, @RequestBody ProductDto product) {
        Product p = productService.update(product, id);
        return ResponseEntity.ok(p);
    }


    @GetMapping("/all")
    public List<Product> getAllProductsNoPagination() {
        return productService.findAllNoPage();
    }
}
