import { Divider, Form, Table } from "antd";
import ThousandSeparator from "./ThousandSeparator.jsx";

export default function PaymentSummary() {
  const payments = Form.useWatch("payments") ?? [];
  const spares = Form.useWatch("spares") ?? [];
  const services = Form.useWatch("services") ?? [];

  const columns = [
    {
      dataIndex: "label",
      rowScope: "row",
      key: "label",
      width: "40%",
    },
    {
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            <ThousandSeparator value={record.amount} />
          </span>
          <span>TZS</span>
        </div>
      ),
    },
  ];

  function updateTotalSummary() {
    const paymentTotal =
      payments.reduce(
        (acc, curr) => Number(acc) + Number(curr?.amount ?? 0),
        0,
      ) ?? 0;

    const serviceTotal = services.reduce(
      (acc, curr) =>
        Number(acc) + Number(curr?.quantity ?? 0) * Number(curr?.price ?? 0),
      0,
    );
    const spareTotal =
      spares.reduce(
        (acc, curr) =>
          Number(acc) + Number(curr?.quantity ?? 0) * Number(curr?.price ?? 0),
        0,
      ) ?? 0;

    return [
      { amount: serviceTotal + spareTotal, id: 1, label: "Total Cost" },
      { amount: paymentTotal, id: 2, label: "Total Paid" },
      {
        amount: Math.max(serviceTotal + spareTotal - paymentTotal, 0),
        id: 3,
        label: "Remaining Amount",
      },
    ];
  }

  return (
    <>
      <Divider orientation="left" plain>
        TOTAL
      </Divider>

      <Table
        bordered
        rowKey="id"
        style={{ width: "40%" }}
        columns={columns}
        showHeader={false}
        dataSource={updateTotalSummary()}
        pagination={false}
        size="middle"
      />
    </>
  );
}
