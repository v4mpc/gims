import { InfoCircleOutlined } from "@ant-design/icons";
import { Select, Form, Flex, Input } from "antd";
import {API_ROUTES, getLookupData, toCustomerCars} from "../utils.jsx";

import { optionLabelFilter } from "../utils.jsx";
import {useQuery} from "@tanstack/react-query";

const CustomerSection = ({ form }) => {


    const customerQuery = useQuery( {
        queryKey: ["customerAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.customersAll),
    })

    const onSelectChange = (value) => {
        const [filteredCustomer] = customers.filter(
            (c) => Number(c.id) === Number(value),
        );
        form.setFieldsValue({
            customerName: filteredCustomer.customerName,
            customerPhone: filteredCustomer.customerPhone,
            plateNumber: filteredCustomer.plateNumber,
            make: filteredCustomer.make,
            model: filteredCustomer.model,
        });
    };


  const customers = toCustomerCars(customerQuery.data);
  return (
    <Flex justify="space-between" wrap>
      <Form.Item
        label="Customer vehicle"
        tooltip={{
          title:
            "Vehicle name is in format PlateNumber-Make-Model-CustomerName",
          icon: <InfoCircleOutlined />,
        }}
        rules={[
          {
            required: true,
            message: "Please input!",
          },
        ]}
        name="customerCar"
      >
        <Select
          placeholder="Select customer vehicle"
          loading={customerQuery.isLoading}
          style={{ width: "400px" }}
          showSearch
          onChange={onSelectChange}
          filterOption={optionLabelFilter}
          options={customers.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        ></Select>
      </Form.Item>
      <Form.Item name="customerName" label="Customer name">
        <Input disabled={true} />
      </Form.Item>

      <Form.Item name="customerPhone" label="Customer phone">
        <Input disabled={true} />
      </Form.Item>

      <Form.Item name="plateNumber" label="Vehicle plate number">
        <Input disabled={true} />
      </Form.Item>
      <Form.Item name="make" label="Vehicle make">
        <Input disabled={true} />
      </Form.Item>

      <Form.Item name="status" hidden={true} label="Vehicle make">
        <Input disabled={true} />
      </Form.Item>
      <Form.Item name="model" label="Vehicle model">
        <Input disabled={true} />
      </Form.Item>
    </Flex>
  );
};

export default CustomerSection;
