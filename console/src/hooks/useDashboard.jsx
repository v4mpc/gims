import { useState } from "react";
import dayjs from "dayjs";
import { API_ROUTES, getLookupData, LINE_TENSION } from "../utils.jsx";
import { useQueries } from "@tanstack/react-query";

export function useDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const yearMonth = selectedMonth.format("YYYY-MM");
  const results = useQueries({
    queries: [
      {
        queryKey: ["dashboard", yearMonth],
        placeholderData: {},
        queryFn: () => getLookupData(`${API_ROUTES.dashboard}?m=${yearMonth}`),
      },
    ],
  });
  const [dashboardQuery] = results;

  const chartData = {
    labels: dashboardQuery.data?.chartLabel,
    datasets: [
      {
        label: "Expenses",
        data: dashboardQuery.data?.expensesChartData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        lineTension: LINE_TENSION,
      },
      {
        label: "Sales",
        data: dashboardQuery.data?.salesChartData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        lineTension: LINE_TENSION,
      },
    ],
  };

  return [
    dashboardQuery.data,
    dashboardQuery.isLoading,
    chartData,
    selectedMonth,
    setSelectedMonth,
  ];
}
