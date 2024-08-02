package com.yhm.gims.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockEvent {


    @NotNull
    private int productId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private LocalDate eventDate;

    @NotNull
    private float quantity;

    @NotNull
    TransactionType tx;
}
