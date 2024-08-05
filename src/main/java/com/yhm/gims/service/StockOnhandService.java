package com.yhm.gims.service;

import com.yhm.gims.domain.StockEvent;
import com.yhm.gims.domain.TransactionType;
import com.yhm.gims.dto.StockOnhandDto;
import com.yhm.gims.entity.Product;
import com.yhm.gims.entity.StockOnhand;
import com.yhm.gims.exception.BadRequestException;
import com.yhm.gims.repository.StockOnhandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class StockOnhandService {

    private final StockOnhandRepository stockOnhandRepository;
    private final ProductService productService;


    public void save(StockOnhand stockOnhand) {
        stockOnhandRepository.save(stockOnhand);
    }


    public void update(StockEvent event) {

//        TODO :: add check to for only active Products

        Product dbProduct = productService.getProduct(event.getProductId());
        Optional<StockOnhand> optionalStockOnhand = stockOnhandRepository.findFirstByProductIdOrderByCreatedAtDesc(event.getProductId());
        if (optionalStockOnhand.isEmpty()) {
            StockOnhand newStockOnHand = StockOnhand.builder()
                    .quantity(event.getQuantity())
                    .createdAt(event.getEventDate())
                    .product(dbProduct)
                    .build();
            save(newStockOnHand);
            return;
        }
        StockOnhand dbStockOnhand = optionalStockOnhand.get();
        dbStockOnhand.setCreatedAt(event.getEventDate());
        if (TransactionType.CREDIT == event.getTx()) {
            if (dbStockOnhand.getQuantity() < event.getQuantity()) {
                throw new BadRequestException("Quantity do decrease is greater than the current stock on hand");
            }
            dbStockOnhand.setQuantity(dbStockOnhand.getQuantity() - event.getQuantity());
        } else if (TransactionType.DEBIT == event.getTx()) {
            dbStockOnhand.setQuantity(dbStockOnhand.getQuantity() + event.getQuantity());
        } else {
            throw new BadRequestException("Unknown TransactionType");
        }
        save(dbStockOnhand);
    }


    public float get(int productId, LocalDate stockDate) {
        Product dbProduct = productService.getProduct(productId);
        Optional<StockOnhand> optionalStockOnhand = stockOnhandRepository.findFirstByProductIdAndCreatedAtLessThanEqualOrderByCreatedAtDesc(dbProduct.getId(), stockDate);
        if (optionalStockOnhand.isEmpty()) {
            return 0;
        }
        return optionalStockOnhand.get().getQuantity();
    }

    public StockOnhandDto toStockOnhandDto(Product product, LocalDate localDate) {
        return StockOnhandDto.builder()
                .product(product)
                .stockOnhand(get(product.getId(), localDate))
                .build();
    }


    public boolean hasCategory(StockOnhandDto sohDto, String categoryId) {
        if (categoryId.equals("ALL")) {
            return true;
        }
        return sohDto.getProduct().getCategory().getId() == Integer.parseInt(categoryId);
    }

    public boolean hasNameOrCode(StockOnhandDto sohDto, String searchTerm) {
        return sohDto.getProduct().getName().toLowerCase().contains(searchTerm.toLowerCase()) || sohDto.getProduct().getCode().toLowerCase().contains(searchTerm.toLowerCase());
    }


    public Page<StockOnhandDto> findAll(String searchTerm, String categoryId, Pageable pageable) {
        Page<Product> productsPage = productService.findAll(pageable);
        List<Product> products = productsPage.getContent();
        Pageable productsPageable = productsPage.getPageable();
        long productsTotal = productsPage.getTotalElements();
        List<StockOnhandDto> soh = products.stream().map(p -> toStockOnhandDto(p, LocalDate.now())).filter(s -> hasCategory(s, categoryId)).filter(s -> hasNameOrCode(s, searchTerm)).toList();
        return new PageImpl<>(soh, productsPageable, productsTotal);
    }


    public boolean hasNonZeroStock(StockOnhandDto sohDto) {
        return sohDto.getStockOnhand() > 0;
    }


    public List<StockOnhandDto> findAll(boolean nonZeroSoh) {
        List<Product> products = productService.findAll();
        if (nonZeroSoh) {
            return products.stream().map(p -> toStockOnhandDto(p, LocalDate.now())).filter(this::hasNonZeroStock).toList();
        }
        return products.stream().map(p -> toStockOnhandDto(p, LocalDate.now())).toList();
    }


}
