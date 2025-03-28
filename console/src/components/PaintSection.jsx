import {
  thousanSeparatorformatter,
  thousanSeparatorparser,
} from "../utils.jsx";
import { Button, Flex, Form, Input, InputNumber, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const PaintSection = ({ viewMode }) => {
  return (
    <Form.List name="paints">
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Flex
              gap="large"
              key={key}
              style={{
                display: "flex",
                marginBottom: 8,
              }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, "item"]}
                label={key === 0 ? "Item" : ""}
                min={1}
                rules={[{ required: true, message: "Missing item" }]}
              >
                <Input style={{ width: "250px" }} placeholder="Item" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "price"]}
                label={key === 0 ? "Price" : ""}
                min={1}
                rules={[{ required: true, message: "Missing Price" }]}
              >
                <InputNumber
                  style={{ width: "150px" }}
                  formatter={thousanSeparatorformatter}
                  parser={thousanSeparatorparser}
                  min={1}
                  placeholder="Price"
                />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "quantity"]}
                label={key === 0 ? "Quantity" : ""}
                rules={[{ required: true, message: "Missing quantity" }]}
              >
                <InputNumber
                  formatter={thousanSeparatorformatter}
                  parser={thousanSeparatorparser}
                  placeholder="Quantity"
                  min={1}
                />
              </Form.Item>

              <Space align={key === 0 ? undefined : "baseline"}>
                <Form.Item
                  {...restField}
                  label={key === 0 ? "Total" : ""}
                  {...restField}
                  name={[name, "total"]}
                >
                  <InputNumber
                    formatter={thousanSeparatorformatter}
                    parser={thousanSeparatorparser}
                    disabled
                    style={{ width: "200px" }}
                    placeholder="Total"
                  />
                </Form.Item>

                {viewMode || (
                  <MinusCircleOutlined onClick={() => remove(name)} />
                )}
              </Space>
            </Flex>
          ))}
          <Form.Item>
            {viewMode || (
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add Item
              </Button>
            )}
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default PaintSection;
