import { Flex, Space } from "antd";
import ThousandSeparator from "../../components/ThousandSeparator.jsx";
import {StatusTag} from "../../components/StatusTag.jsx";
const listPaintColumns = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    width: "5%",
    render: (_, record) => record.paint.id,
  },
    {
        title: "Date",
        key: "createdAt",
        dataIndex: "createdAt",
        render:(_,record)=>record.paint.createdAt
    },

  {
    title: "Customer Name",
    key: "customerName",
    dataIndex: "customerName",
  },

  {
    title: "Customer Phone",
    key: "customerPhone",
    dataIndex: "customerPhone",
  },

  {
    title: "Vehicle",
    key: "vehicle",
    dataIndex: "vehicle",
    render: (_, record) => (
      <Flex vertical>
        <Space key={`make${record.paint.id}`}>Make : {record.paint.customerCar.make}</Space>
        <Space key={`model${record.paint.id}`}>Model : {record.paint.customerCar.model}</Space>
        <Space key={`plate${record.paint.id}`}>Plate : {record.paint.customerCar.plateNumber}</Space>
      </Flex>
    ),
  },

  {
    title: "Amounts",
    key: "amounts",
    dataIndex: "amounts",
    render: (_, record) => {
      const totalPaid = record.paint.initialPayment + record.paint.finalPayment;
      const estimateAmount = record.paint.estimateAmount;
      const remain =
        estimateAmount - totalPaid >= 0 ? estimateAmount - totalPaid : 0;
      return (
        <Flex vertical>
          <Space>Total : {<ThousandSeparator value={estimateAmount} />}</Space>
          <Space>Paid : {<ThousandSeparator value={totalPaid} />}</Space>
          <Space>Remaining : {<ThousandSeparator value={remain} />}</Space>
        </Flex>
      );
    },
  },

  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (_, record) => (<StatusTag status={record.paint.status}/>),
  },

  {
    title: "Action",
    key: "paint",
  },
];

export default listPaintColumns;
