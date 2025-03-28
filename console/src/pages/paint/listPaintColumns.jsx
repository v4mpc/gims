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
        const totalPaid = record.paint.payments.reduce(
            (acc, curr) => acc + curr.amount,
            0,
        );
        const grandTotal =
            record.paint.paints.reduce(
                (acc, cr) => acc + cr.quantity * cr.price,
                0,
            )
        const remain =Math.max(
            record.paint.includeEstimateAmount
                ? record.paint.estimateAmount - totalPaid
                : grandTotal - totalPaid,
            0,
        );
        return (
            <Flex vertical key={`amount${record.paint.id}`}>
                <Space key={`cost${record.paint.id}`}>
                    Total cost : {<ThousandSeparator value={grandTotal} />}
                </Space>
                <Space key={`paid${record.paint.id}`}>
                    Paid : {<ThousandSeparator value={totalPaid} />}
                </Space>
                <Space key={`rem${record.paint.id}`}>
                    Remaining : {<ThousandSeparator value={remain} />}
                </Space>
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
