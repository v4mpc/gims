package com.yhm.gims.dto;

import com.yhm.gims.entity.Category;
import com.yhm.gims.entity.Paint;
import com.yhm.gims.entity.Unit;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@AllArgsConstructor
@Data
@Builder
public class PaintDto {


    @NotNull
    private Paint paint;

    @NotNull
    private String customerName;





}
