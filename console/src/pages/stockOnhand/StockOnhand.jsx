import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES, getLookupData } from "../../utils.jsx";

import {
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Flex
} from "antd";
import stockOnhandColumns from "./Columns.jsx";
import { useQueries } from "@tanstack/react-query";
import {InfoCircleOutlined} from "@ant-design/icons";
import {useState} from "react";

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




    const validateAmount = (rule, value, callback) => {
        if (value === 0) {
            callback("Adjustment quantity can not be zero");
        } else if (value < 0 && value * -1 > selectedProduct.stockOnhand) {
            callback("Negative adjustment should not exceed stock on hand");
        } else {
            callback();
        }
    };





  return (
    <GenericTable
      itemColumns={stockOnhandColumns}
      listPath={API_ROUTES.stockOnhand}
      showCategoryFilter={true}
      queryKey="stockOnhand"
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
                  title: "Stock on hand as of now (2024-04-29,00:00)",
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

                  {
                      validator: validateAmount,
                  },
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
