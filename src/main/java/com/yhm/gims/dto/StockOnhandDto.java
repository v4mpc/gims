package com.yhm.gims.dto;


import com.yhm.gims.entity.Product;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockOnhandDto {

    private Product product;
    private float stockOnhand;

}
