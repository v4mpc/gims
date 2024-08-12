import { useEffect, useState } from "react";
import {
  API_ROUTES,
  BASE_URL,
  DATE_FORMAT,
  filterOption,
  generateColumns,
  generateFilter,
  toObject,
} from "../../utils.jsx";

import { Col, Card, Row, Form, Table, Button, Select } from "antd";
import dayjs from "dayjs";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const filteredReports = reports.filter((report) => report.active);
  const reportColumns = selectedReport
    ? generateColumns(selectedReport.columnOption)
    : [];
  const reportFilters = selectedReport
    ? toObject(selectedReport.filterOption)
    : [];
  const handleReportChange = (e) => {
    if (e) {
      setSelectedReport(
        ...filteredReports.filter((report) => Number(report.id) === Number(e)),
      );
    }
  };

  function handleApplyFilter(values) {
    let modifiedData = values;
    if (Object.hasOwn(modifiedData, "dateRange")) {
      Date.prototype.toISOString = function () {
        return dayjs(this).format(DATE_FORMAT);
      };
      modifiedData = {
        ...modifiedData,
        dateFrom: modifiedData.dateRange[0].format(DATE_FORMAT),
        dateTo: modifiedData.dateRange[1].format(DATE_FORMAT),
      };
      delete modifiedData.dateRange;
    }

    if (
      Object.hasOwn(modifiedData, "product") &&
      modifiedData.product !== undefined
    ) {
      modifiedData = {
        ...modifiedData,
        product: modifiedData.product,
      };
    }


    let initData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    initData.body = JSON.stringify(modifiedData);
    getReportData(initData);
  }

  async function getReportData(filterOptions) {
    setIsLoading(true);
    const resp = await fetch(
      `${BASE_URL}/${API_ROUTES.fetchReportData}`,
      filterOptions,
    );
    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    const respData = await resp.json();
    setReportData(respData)
    setIsLoading(false);
  }

  async function getReportList() {
    setIsLoading(true);
    const resp = await fetch(`${BASE_URL}/${API_ROUTES.customReport}`);
    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    const respData = await resp.json();
    const sortedItems = [...respData].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    setReports(sortedItems);
    setIsLoading(false);
  }

  useEffect(() => {
    getReportList();
  }, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title="Report filter" style={{ "overflowX":"auto"}}>
          <Form
            variant="outlined"
            layout="vertical"
            disabled={isLoading}
            onFinish={handleApplyFilter}
          >
            <Form.Item
              label="Report name"
              rules={[
                {
                  required: "Select report",
                  message: "Select report",
                },
              ]}
              name="report"
            >
              <Select
                placeholder="Select Report"
                onChange={handleReportChange}
                filterOption={filterOption}
                showSearch={true}
                options={filteredReports.map((report) => ({
                  value: report.id,
                  label: report.reportName,
                }))}
              ></Select>
            </Form.Item>
            {reportFilters.map((filter) => generateFilter(filter))}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Apply filter
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={18}>
        <Card
          title={`${selectedReport ? selectedReport.reportName : "Select Report"}`} style={{ "overflowX":"auto"}}
        >
          <Table
            columns={reportColumns}
            loading={isLoading}
            dataSource={reportData}
            bordered={true}
            rowKey="id"
          />
        </Card>
      </Col>
    </Row>
  );
}
