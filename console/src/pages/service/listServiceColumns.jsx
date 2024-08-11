import { Flex, Space } from "antd";
import ThousandSeparator from "../../components/ThousandSeparator.jsx";
import {StatusTag} from "../../components/StatusTag.jsx";
const listServiceColumns = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    width: "5%",
    render: (_, record) => record.service.id,
  },


    {
        title: "Date",
        key: "createdAt",
        dataIndex: "createdAt",
        render:(_,record)=>record.service.createdAt
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
        <Space key={`make${record.service.id}`}>Make : {record.service.customerCar.make}</Space>
        <Space key={`model${record.service.id}`}>Model : {record.service.customerCar.model}</Space>
        <Space key={`plate${record.service.id}`}>Plate : {record.service.customerCar.plateNumber}</Space>
      </Flex>
    ),
  },

  {
    title: "Amounts",
    key: "amounts",
    dataIndex: "amounts",
    render: (_, record) => {
      const totalPaid = record.service.initialPayment + record.service.finalPayment;
      const grandTotal = record.service.services.reduce(( (acc, cr) => acc + cr.quantity * cr.price),0)+record.service.spares.reduce(( (acc, cr) => acc + cr.quantity * cr.price),0);
      const remain =
        grandTotal - totalPaid >= 0 ? grandTotal - totalPaid : 0;
      return (
        <Flex vertical>
          <Space>Total : {<ThousandSeparator value={grandTotal} />}</Space>
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
    render: (_, record) => (<StatusTag status={record.service.status}/>),
  },

  {
    title: "Action",
    key: "service",
  },
];

export default listServiceColumns;
