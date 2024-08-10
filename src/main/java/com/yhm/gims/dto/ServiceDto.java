package com.yhm.gims.dto;

import com.yhm.gims.entity.GService;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@AllArgsConstructor
@Data
@Builder
public class ServiceDto {


    @NotNull
    private GService GService;

    @NotNull
    private String customerName;



    @NotNull
    private String customerPhone;





}
