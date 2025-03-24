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
      <Flex vertical key="vh">
        <Space key={`make${record.paint.id}11`}>Make : {record.paint.customerCar.make}</Space>
        <Space key={`model${record.paint.id}22`}>Model : {record.paint.customerCar.model}</Space>
        <Space key={`plate${record.paint.id}33`}>Plate : {record.paint.customerCar.plateNumber}</Space>
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
        <Flex vertical key='am'>
          <Space key={`make${record.paint.id}12`}>Total : {<ThousandSeparator key={`make${record.paint.id}124`} value={estimateAmount} />}</Space>
          <Space key={`model${record.paint.id}13`}>Paid : {<ThousandSeparator key={`make${record.paint.id}12g`} value={totalPaid} />}</Space>
          <Space key={`model${record.paint.id}34`}>Remaining : {<ThousandSeparator key={`make${record.paint.id}12k`} value={remain} />}</Space>
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
      dataIndex: "action"
  },
];

export default listPaintColumns;
