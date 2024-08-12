import { Flex, Statistic, DatePicker, Table, Divider, Card, Tooltip } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
    Tooltip as ChartTooltip,

  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDashboard } from "../hooks/useDashboard.jsx";
import Loader from "../components/Loader.jsx";
import ThousandSeparator from "../components/ThousandSeparator.jsx";
import { DASHBOARD_DIVIDER_ORIENTATION, DASHBOARD_METRICS_PRECISION } from "../utils.jsx";
import { InfoCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Sells and Expenses trends",
    },
  },
};

const columns = [
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Product",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Sold",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Total(TZS)",
    dataIndex: "total",
    key: "total",
    render: (_, record) => (
      <ThousandSeparator value={record.quantity * record.salePrice} />
    ),
  },
];

const expensesColumn = [
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Amount(TZS)",
    dataIndex: "amount",
    key: "amount",
    render: (_, record) => <ThousandSeparator value={record.amount} />,
  },
];

export default function Dashboard() {
  const [dashboardData, isLoading, chartData, selectedMonth, setSelectedMonth] =
    useDashboard();
  return (
    <Flex gap="middle" vertical>
      <Flex justify="space-between">
        <h2>{selectedMonth.format("MMMM YYYY")} | Metrics</h2>
        <Flex align="center" gap="middle">

          <Tooltip title="Select Year Month to display metrics" style={{ marginRight: "2px" }}>
            <span><InfoCircleTwoTone style={{ fontSize: "20px" }} /></span>
          </Tooltip>
          <DatePicker
              maxDate={dayjs()}
            value={selectedMonth}
            onChange={(e) => {
              e && setSelectedMonth(e);
            }}
            picker="month"
          />

        </Flex>
      </Flex>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Flex vertical gap="large">
            <Flex justify="space-between">


                <Statistic
                  title="Total Sells"
                  value={dashboardData?.totalSales}
                  precision={DASHBOARD_METRICS_PRECISION}
                />

                <Statistic
                  title="Sells Profit"
                  value={dashboardData?.totalSalesProfit}
                  precision={DASHBOARD_METRICS_PRECISION}
                />

                <Statistic
                  title="Total Expenses"
                  value={dashboardData?.totalExpenses}
                  precision={DASHBOARD_METRICS_PRECISION}
                />

                <Statistic
                  title="Net Profit"
                  value={dashboardData?.totalNetProfit}
                  precision={DASHBOARD_METRICS_PRECISION}
                />

                <Statistic
                  title="Products Sold"
                  value={dashboardData?.productsSold}
                  precision={DASHBOARD_METRICS_PRECISION}
                />

              <Statistic
                  title="Stock Value"
                  value={dashboardData?.totalSellStock}
                  precision={DASHBOARD_METRICS_PRECISION}
              />

            </Flex>
          </Flex>
          <Flex>
            <Divider orientation={DASHBOARD_DIVIDER_ORIENTATION}>Sells / Expenses trends</Divider>
          </Flex>
          <Flex vertical>
            <Line options={options} data={chartData} height={"90%"} />
          </Flex>
          <Flex>
            <Divider orientation={DASHBOARD_DIVIDER_ORIENTATION}>Sells / Expenses summary</Divider>
          </Flex>

          <Flex vertical={false} gap="middle">
            <Card
              styles={{ body: { padding: "0px" } }}
              style={{
                width: "50%",
              }}
            >

              <Table
                title={() => "Top Sells"}
                columns={columns}
                dataSource={dashboardData?.topSales}
                scroll={{ x: 'max-content' }}

              />

            </Card>



            <Card
              styles={{ body: { padding: "0px" } }}
              style={{
                width: "50%",
              }}
            >
              <Table
                title={() => "Top Expenses"}
                columns={expensesColumn}
                dataSource={dashboardData?.topExpenses}
                scroll={{ x: 'max-content' }}
              />
            </Card>
          </Flex>
        </>
      )}
    </Flex>
  );
}
