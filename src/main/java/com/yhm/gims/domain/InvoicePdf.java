package com.yhm.gims.domain;


import com.yhm.gims.util.NumberFormatUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.DecimalFormat;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoicePdf {


    List<InvoicePdfItem> items;
    Double percentageVatInDecimal = 0.0;
    Double subTotal;


    public String getTotal() {
        if (percentageVatInDecimal <= 0.0) {
            return NumberFormatUtil.format(subTotal);
        }
        return NumberFormatUtil.format(subTotal * percentageVatInDecimal);
    }


    public String getSubTotal() {
        return NumberFormatUtil.format(subTotal);
    }


    public String getVat() {
        if (percentageVatInDecimal <= 0.0) {
            return "-";
        }
        return NumberFormatUtil.format(subTotal * percentageVatInDecimal);
    }
}
