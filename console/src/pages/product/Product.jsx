import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES, getLookupData } from "../../utils.jsx";

import {Form, Input, Select, InputNumber, Checkbox, Flex, Divider, Space, Button} from "antd";
import productColumns from "./Columns.jsx";
import { useQueries } from "@tanstack/react-query";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

export default function Product() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["unitsAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.unitsAll),
      },
      {
        queryKey: ["categoriesAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.categoriesAll),
      },

        {
            queryKey: ["vehiclesAll"],
            placeholderData: [],
            queryFn: () => getLookupData(API_ROUTES.vehiclesAll+"?make=false"),
        },
    ],
  });
  const [unitsQuery, categoriesQuery,vehiclesQuery] = results;

  return (
    <GenericTable
      itemColumns={productColumns}
      listPath={API_ROUTES.products}
      queryKey="products"
    >
      <>
        <Form.Item
          label="Code"
          name="code"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Flex justify="space-between">
          <Form.Item
            label="Buy price"
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}
            name="buyPrice"
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Sale price"
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}
            name="salePrice"
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Flex>

        <Flex justify="space-between">
          <Form.Item
            label="Unit"
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}
            name="unitOfMeasure"
          >
            <Select
              placeholder="Select unit"
              loading={unitsQuery.isLoading}
              options={unitsQuery.data.map((unit) => ({
                value: unit.id,
                label: unit.code,
              }))}
            ></Select>
          </Form.Item>

          <Form.Item
            label="Catetory"
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}
            name="category"
          >
            <Select
              placeholder="Select category"
              loading={categoriesQuery.isLoading}
              options={categoriesQuery.data.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            ></Select>
          </Form.Item>
        </Flex>






                           <Form.Item
                                label="Models"
                               name="vehicles"
                           >
                               <Select
                                   mode="multiple"
                                   allowClear
                                   style={{
                                       width: '100%',
                                   }}
                                   placeholder="Please select"

                                   options={vehiclesQuery.data.map((make) => ({
                                       value: make.id,
                                       label: make.name,
                                   }))}
                               />
                           </Form.Item>


        <Form.Item name="active" valuePropName="checked">
          <Checkbox>Active</Checkbox>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
      </>
    </GenericTable>
  );
}
