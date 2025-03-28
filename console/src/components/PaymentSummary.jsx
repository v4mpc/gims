import { Divider, Form, Table } from "antd";
import ThousandSeparator from "./ThousandSeparator.jsx";

export default function PaymentSummary({ updateTotalSummary, columns }) {
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
