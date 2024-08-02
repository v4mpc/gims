package com.yhm.gims.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yhm.gims.domain.StockEvent;
import com.yhm.gims.domain.TransactionType;
import com.yhm.gims.exception.BadRequestException;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class AdjustDto {


    @NotNull
    @Getter
    @Setter
    private int productId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Getter
    @Setter
    @NotNull
    private LocalDate adjustmentDate;

    @NotNull
    private float adjustmentQuantity;

    @JsonIgnore
    TransactionType tx;

    public float getAdjustmentQuantity() {
        return Math.abs(this.adjustmentQuantity);
    }


    public void setAdjustmentQuantity(float quantity) {
        if (0 == quantity) {
            throw new BadRequestException("Adjustment quantity can not be zero");
        }
        this.adjustmentQuantity = quantity;
    }


    public TransactionType getTx() {
        if (adjustmentQuantity > 0) {
            return TransactionType.DEBIT;
        }
        return TransactionType.CREDIT;
    }


    public StockEvent toStockEvent() {
        return StockEvent.builder().eventDate(getAdjustmentDate())
                .tx(getTx())
                .quantity(getAdjustmentQuantity())
                .productId(getProductId())
                .build();

    }

}
