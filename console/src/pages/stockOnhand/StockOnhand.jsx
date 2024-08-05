import GenericTable from "../../components/GenericTable.jsx";
import {API_ROUTES, DATE_FORMAT, getLookupData} from "../../utils.jsx";

import { Form, Input, Select, InputNumber, Checkbox, Flex } from "antd";
import stockOnhandColumns from "./Columns.jsx";
import { useQueries } from "@tanstack/react-query";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";


export default function StockOnhand() {
  const [selectedProduct, setSelectedProduct] = useState("");
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
        queryFn: () => getLookupData(API_ROUTES.vehiclesAll + "?make=false"),
      },
    ],
  });
  const [unitsQuery, categoriesQuery, vehiclesQuery] = results;



  return (
    <GenericTable
      itemColumns={stockOnhandColumns}
      listPath={API_ROUTES.stockOnhand}
      showCategoryFilter={true}
      queryKey="stockOnhand"
      showAddButton={false}
    >
      <>
        <Form.Item label="ProductId" name="productId" hidden={true}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item label="adjustmentDate" name="adjustmentDate" hidden={true}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item label="Product" name="name">
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          label="Stock on hand(@)"
          tooltip={{
            title: `"Stock on hand as of now (${dayjs().format(DATE_FORMAT)})"`,
            icon: <InfoCircleOutlined />,
          }}
          name="stockOnhand"
        >
          <InputNumber

            style={{
              width: "100%",
            }}
            disabled={true}
          />
        </Form.Item>

        <Form.Item
          label="Quantity to adjust(@)"
          name="adjustmentQuantity"
          tooltip={{
            title:
              "Negative(-) value decreases stock e.g -80, Positive value increases stock e.g 80.",
            icon: <InfoCircleOutlined />,
          }}
          rules={[
            {
              required: true,
              message: "Please input a number",
            },


            //   TODO : add negative adjustment should not subseed soh validation

            ({ getFieldValue }) => ({
              validator(_, value) {
                console.log(selectedProduct.stockOnhand);
                if (value === 0) {
                  return Promise.reject(
                    new Error("Adjustment quantity can not be zero"),
                  );
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <InputNumber
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Provide reason!",
            },
          ]}
          label="Adjustment Reason"
          name="reason"
        >
          <Input.TextArea />
        </Form.Item>
      </>
    </GenericTable>
  );
}
