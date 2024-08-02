package com.yhm.gims.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yhm.gims.domain.StockEvent;
import com.yhm.gims.domain.TransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Setter
@Getter
public class SaleDto extends AdjustDto {

    @NotNull
    private Float saleAdjustment;

    private String description;

    private Boolean isSale;

    @Override
    public TransactionType getTx() {
        if (isSale) {
            return TransactionType.CREDIT;
        }
        return TransactionType.DEBIT;
    }

    @Override
    public StockEvent toStockEvent() {
        return StockEvent.builder().eventDate(getAdjustmentDate())
                .tx(getTx())
                .quantity(getAdjustmentQuantity())
                .productId(getProductId())
                .build();

    }


}
