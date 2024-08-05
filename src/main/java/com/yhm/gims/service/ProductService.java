package com.yhm.gims.service;


import com.yhm.gims.dto.ProductDto;
import com.yhm.gims.entity.Product;
import com.yhm.gims.entity.Unit;
import com.yhm.gims.entity.Vehicle;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.ProductRepository;
import com.yhm.gims.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final VehicleRepository vehicleRepository;


    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<Product> findAllNoPage() {
        return productRepository.findAll();
    }

    public Page<Product> findByName(String name, Pageable pageable) {
        if (Objects.equals(name, "%")) {
            Sort sort = Sort.by(Sort.Direction.ASC, "name");
            PageRequest newPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
            return productRepository.findAll(newPageable);
        }
        return productRepository.findByNameContainingIgnoreCaseOrderByNameAsc(name, pageable);
    }


    public Page<Product> getProducts(String searchTerm, Pageable pageable) {

        if (searchTerm == null || searchTerm.isEmpty()) {
            return productRepository.findAll(pageable);
        } else {
            return productRepository.search(searchTerm, pageable);
        }

    }


    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public void save(ProductDto productDto) {
        Product product = Product.builder()
                .code(productDto.getCode())
                .name(productDto.getName())
                .salePrice(productDto.getSalePrice())
                .buyPrice(productDto.getBuyPrice())
                .description(productDto.getDescription())
                .category(productDto.getCategory())
                .unitOfMeasure(productDto.getUnitOfMeasure())
                .active(productDto.getActive())
                .vehicles(new HashSet<>(vehicleRepository.findAllById(productDto.getVehicles())))
                .build();

        productRepository.save(product);

    }

    public Product getProduct(int productId) {
        return productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not exist with id " + productId));
    }


    public Product update(Product product, int id) {
        Product updateProduct = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not exist with id " + id));
        updateProduct.setName(product.getName());
        updateProduct.setCode(product.getCode());
        updateProduct.setBuyPrice(product.getBuyPrice());
        updateProduct.setSalePrice(product.getSalePrice());
        updateProduct.setUnitOfMeasure(product.getUnitOfMeasure());
        updateProduct.setCategory(product.getCategory());
        updateProduct.setActive(product.getActive());
        updateProduct.setDescription(product.getDescription());
        productRepository.save(updateProduct);
        return updateProduct;
    }
}
