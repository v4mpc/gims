package com.yhm.gims.dto;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Unit;
import com.yhm.gims.entity.Vehicle;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class ProductDto {

    @NotNull
    private String code;

    @NotNull
    private String name;

    private String description;

    private Unit unitOfMeasure;


    private Category category;


    private Set<Integer> vehicles = new HashSet<>();


    @NotNull
    private Float buyPrice;

    @NotNull
    private Float salePrice;

    private Boolean active = true;


    private Boolean isOil = false;

}
