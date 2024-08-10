package com.yhm.gims.service;


import com.yhm.gims.domain.ProductSpecs;
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
import org.springframework.data.jpa.domain.Specification;
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


    public Page<Product> getProducts(String searchTerm, String categoryId, Pageable pageable) {

            return productRepository.findAll(Specification.anyOf(ProductSpecs.searchByName(searchTerm), ProductSpecs.searchByCode(searchTerm)).and(categoryId.equals("ALL") ? null : ProductSpecs.searchByCategory(Integer.parseInt(categoryId))), pageable);

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
                .isOil(productDto.getIsOil())
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


    public Product update(ProductDto productDto, int id) {
        Product updateProduct = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not exist with id " + id));
        updateProduct.setName(productDto.getName());
        updateProduct.setCode(productDto.getCode());
        updateProduct.setBuyPrice(productDto.getBuyPrice());
        updateProduct.setSalePrice(productDto.getSalePrice());
        updateProduct.setUnitOfMeasure(productDto.getUnitOfMeasure());
        updateProduct.setCategory(productDto.getCategory());
        updateProduct.setActive(productDto.getActive());
        updateProduct.setIsOil(productDto.getIsOil());
        updateProduct.setDescription(productDto.getDescription());
        updateProduct.setVehicles(new HashSet<>(vehicleRepository.findAllById(productDto.getVehicles())));

        productRepository.save(updateProduct);
        return updateProduct;
    }
}
