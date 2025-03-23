package com.yhm.gims.util;

import java.text.DecimalFormat;

public class NumberFormatUtil {
    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("#,###.00");

    public static String format(double number) {
        return DECIMAL_FORMAT.format(number);
    }
}
