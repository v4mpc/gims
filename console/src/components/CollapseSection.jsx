import {
  thousanSeparatorformatter,
  thousanSeparatorparser,
} from "../utils.jsx";
import { InputNumber, Form, Space, Collapse } from "antd";

const CollapseSection = () => {
  const collapseItems = [
    {
      key: "1",
      label: "Amount Details",
      children: (
        <>
          <Space wrap>
            <Form.Item
              name="estimateAmount"
              rules={[
                {
                  required: true,
                  message: "Missing estimate amount",
                },
              ]}
              label="Estimate amount"
            >
              <InputNumber
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                min={1}
                style={{
                  width: "200px",
                }}
              />
            </Form.Item>

            <Form.Item name="grandTotal" label="Actual amount">
              <InputNumber
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                style={{ width: "300px" }}
                disabled={true}
              />
            </Form.Item>

            <Form.Item name="netProfit" label="Net Profit">
              <InputNumber
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                style={{ width: "300px" }}
                disabled={true}
              />
            </Form.Item>
          </Space>
        </>
      ),
    },
  ];

  return (
    <Collapse
      style={{
        marginBottom: "20px",
      }}
      items={collapseItems}
      defaultActiveKey={["1"]}
    />
  );
};

export default CollapseSection;
