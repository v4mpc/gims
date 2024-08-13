package com.yhm.gims.service;


import com.yhm.gims.dto.DashboardDto;
import com.yhm.gims.entity.*;
import com.yhm.gims.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SaleService saleService;
    private final ExpenseService expenseService;
    private final ProductService productService;
    private final StockOnhandService stockOnhandService;
    private final PaintService paintService;
    private final ServiceService serviceService;


    public List<Sale> getSales(YearMonth yearMonth) {
        return saleService.findByMonthAndYear(yearMonth.getMonthValue(), yearMonth.getYear());
    }




    public List<Paint> getPaints(YearMonth yearMonth) {
        return paintService.findByMonthAndYear(yearMonth.getMonthValue(), yearMonth.getYear());
    }



    public List<GService> getServices(YearMonth yearMonth) {
        return serviceService.findByMonthAndYear(yearMonth);
    }


    public List<Expense> getExpenses(YearMonth yearMonth) {
        return expenseService.findByMonthAndYear(yearMonth.getMonthValue(), yearMonth.getYear());
    }


    public Float calculateSellStock(YearMonth yearMonth) {

        LocalDate lastDate = yearMonth.atEndOfMonth();
        List<Product> products = productService.findAllNoPage();
        return products.stream().map(p -> stockOnhandService.toStockOnhandDto(p, lastDate)).map(sohDto -> (sohDto.getProduct().getSalePrice() * sohDto.getStockOnhand())).reduce(0F, Float::sum);
    }

    public Float calculateIndividualProfit(Sale sale) {
        return ((sale.getSalePrice() - sale.getBuyPrice()) + sale.getSaleAdjustment()) * sale.getQuantity();

    }


    public Float getTotalProfit(List<Sale> sales) {
        return sales.stream().map(this::calculateIndividualProfit).reduce(0F, Float::sum);
    }

    public Float getTotalSales(List<Sale> sales) {
        return sales.stream().map(s -> (s.getQuantity() * s.getSalePrice())).reduce(0F, Float::sum);
    }

    public Float getPaintTotalSells(List<Paint> paints){
        return paints.stream().map(p->(p.getInitialPayment()+p.getFinalPayment())).reduce(0F,Float::sum);
    }


    public Float getServiceTotalSells(List<GService> services){
        return services.stream().map(p->(p.getInitialPayment()+p.getFinalPayment())).reduce(0F,Float::sum);
    }

    public Float getTotalExpenses(List<Expense> expenses) {
        return expenses.stream().map(Expense::getAmount).reduce(0F, Float::sum);
    }


    public Float getQuantitySold(List<Sale> sales) {
        return sales.stream().map(Sale::getQuantity).reduce(0F, Float::sum);
    }

    public List<Sale> getTopSales(List<Sale> sales) {
        return sales.stream().sorted(Comparator.comparing(Sale::getQuantity).reversed()).limit(10).toList();
    }


    public List<Expense> getTopExpenses(List<Expense> expenses) {
        return expenses.stream().sorted(Comparator.comparing(Expense::getAmount).reversed()).limit(10).toList();
    }

    public List<String> getLabel(Integer daysInMonth, String monthMMM) {
        return Stream.iterate(1, n -> n <= daysInMonth, n -> n + 1).map(d -> d + " " + monthMMM).toList();
    }

    public List<Float> getSalesTrend(List<Sale> sales, Integer daysInMonth, YearMonth yearMonth) {
        List<LocalDate> localDates = DateUtil.getLocalDateList(daysInMonth, yearMonth);
        return localDates.stream().map((d) -> sales.stream().filter(fp -> (fp.getCreatedAt().isEqual(d))).map(sf -> sf.getSalePrice() * sf.getQuantity()).reduce(0F, Float::sum)).toList();

    }


    public List<Float> getExpensesTrend(List<Expense> expenses, Integer daysInMonth, YearMonth yearMonth) {
        List<LocalDate> localDates = DateUtil.getLocalDateList(daysInMonth, yearMonth);
        return localDates.stream().map((d) -> expenses.stream().filter(fp -> (fp.getCreatedAt().isEqual(d))).map(Expense::getAmount).reduce(0F, Float::sum)).toList();

    }




    public DashboardDto getMetrics(YearMonth yearMonth) {

        List<Expense> expenses = getExpenses(yearMonth);
        List<Sale> sales = getSales(yearMonth);
        Integer daysInMonth = DateUtil.getDaysInMonth(yearMonth);
        String monthMMM = DateUtil.getMMM(yearMonth);
        Float totalExpenses = getTotalExpenses(expenses);
        Float totalSalesProfit = getTotalProfit(sales);
        Float netProfit = totalSalesProfit - totalExpenses;
        Float paintingSell=0F;

        return DashboardDto.builder()
                .totalSales(getTotalSales(sales))
                .totalExpenses(totalExpenses)
                .totalSalesProfit(getTotalProfit(sales))
                .productsSold(getQuantitySold(sales))
                .topSales(getTopSales(sales))
                .totalNetProfit(netProfit)
                .topExpenses(getTopExpenses(expenses))
                .chartLabel(getLabel(daysInMonth, monthMMM))
                .salesChartData(getSalesTrend(sales, daysInMonth, yearMonth))
                .expensesChartData(getExpensesTrend(expenses, daysInMonth, yearMonth))
                .totalSellStock(calculateSellStock(yearMonth))
                .build();
    }


}
