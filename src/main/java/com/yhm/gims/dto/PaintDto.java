package com.yhm.gims.dto;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.entity.Unit;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@AllArgsConstructor
@Data
public class PaintDto {


    @NotNull
    private Integer carId;

    @NotNull
    private String customerName;


    @NotNull
    private String make;


    @NotNull
    private String model;


    private List<Object> paints = new ArrayList<>();


    private LocalDate initialPaymentDate;

    private Float initialPayment;


    private LocalDate finalPaymentDate;

    private Float finalPayment;


    private String accountNumber;

    private Boolean active;

    private String insuranceName;

    private Float estimateAmount;


    private Float grandTotal;

    private Float netProfit;


}
