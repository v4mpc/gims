package com.yhm.gims.util;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;


public final class DateUtil {

    public static YearMonth fromString(String yearMonth) {
        return YearMonth.parse(yearMonth);
    }


    public static int getDaysInMonth(YearMonth yearMonth) {
        return yearMonth.lengthOfMonth();
    }

    public static String getMMM(YearMonth yearMonth) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);
        return formatter.format(yearMonth);
    }

    public static LocalDate fromYearMonth(YearMonth yearMonth, int day) {
        return yearMonth.atDay(day);
    }


    public static List<LocalDate> getLocalDateList(Integer daysInMonth, YearMonth yearMonth) {
        return Stream.iterate(1, n -> n <= daysInMonth, n -> n + 1).map(d -> DateUtil.fromYearMonth(yearMonth, d)).toList();
    }
}
