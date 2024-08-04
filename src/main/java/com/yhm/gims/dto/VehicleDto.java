package com.yhm.gims.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class VehicleDto {


    private String make;

    private List<HashMap<String, String>> models;
}
