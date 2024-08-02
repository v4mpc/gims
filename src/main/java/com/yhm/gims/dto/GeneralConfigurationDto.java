package com.yhm.gims.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class GeneralConfigurationDto {

    @NotNull
    private String lowStockCutOffPoint;

}
