package com.yhm.gims.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReportFilterRequest {

    @NotNull
    private Integer report;


    private Integer product;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateFrom;


    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateTo;

}
