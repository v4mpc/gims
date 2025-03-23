package com.yhm.gims.domain;


import com.yhm.gims.util.NumberFormatUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoicePdfItem {

    String description;
    Integer price;
    Double quantity;


    public Double getTotalPrice() {
        return price * quantity;
    }

    public String getTotalPriceString() {
        return NumberFormatUtil.format(price * quantity);
    }


    public String getPrice() {
        return NumberFormatUtil.format(price);
    }
}
