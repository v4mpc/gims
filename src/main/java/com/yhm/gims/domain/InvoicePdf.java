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
    Float percentageVatInDecimal = 0F;
    Float subTotal;
    String title;
    String customerName;
    String address;
    String invoiceNumber;
    String invoiceDate;



    public String getTotal() {
        if (percentageVatInDecimal <= 0F) {
            return NumberFormatUtil.format(subTotal);
        }
        return NumberFormatUtil.format((subTotal * percentageVatInDecimal) + subTotal);
    }


    public String getSubTotal() {
        return NumberFormatUtil.format(subTotal);
    }


    public String getVat() {
        if (percentageVatInDecimal <= 0F) {
            return "-";
        }
        return NumberFormatUtil.format(subTotal * percentageVatInDecimal);
    }
}
