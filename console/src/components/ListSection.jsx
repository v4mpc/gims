import {
  thousanSeparatorformatter,
  thousanSeparatorparser,
} from "../utils.jsx";
import {Button, Flex, Form, Input, InputNumber, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const ListSection = ({saveOnlyValidations,onPriceChange,onQuantityChange}) => {
  return (
    <Form.List
      name="paints"
      rules={[
        // {
        //   validator: async (_, names) => {
        //     if (!names || names.length < 1) {
        //       //   TODO : this should trigger when finalize/print invoice is clicked
        //       //  TODO  Infact add dynamic validation on required field on finalize/print clicked
        //       return Promise.reject(new Error("At least 1 Item required"));
        //     }
        //   },
        // },

        ...(saveOnlyValidations
          ? []
          : [
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    //   TODO : this should trigger when finalize/print invoice is clicked
                    //  TODO  Infact add dynamic validation on required field on finalize/print clicked
                    return Promise.reject(
                      new Error("At least 1 Item required"),
                    );
                  }
                },
              },
            ]),
      ]}
    >
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
                rules={[
                  ...(saveOnlyValidations
                    ? []
                    : [{ required: true, message: "Missing item" }]),
                ]}
              >
                <Input style={{ width: "250px" }} placeholder="Item" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "price"]}
                label={key === 0 ? "Price" : ""}
                min={1}
                rules={[
                  ...(saveOnlyValidations
                    ? []
                    : [{ required: true, message: "Missing Price" }]),
                ]}
              >
                <InputNumber
                  style={{ width: "150px" }}
                  formatter={thousanSeparatorformatter}
                  parser={thousanSeparatorparser}
                  min={1}
                  onChange={(value) => onPriceChange(value, key)}
                  placeholder="Price"
                />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "quantity"]}
                label={key === 0 ? "Quantity" : ""}
                rules={[
                  ...(saveOnlyValidations
                    ? []
                    : [{ required: true, message: "Missing quantity" }]),
                ]}
              >
                <InputNumber
                  formatter={thousanSeparatorformatter}
                  parser={thousanSeparatorparser}
                  placeholder="Quantity"
                  min={1}
                  onChange={(value) => onQuantityChange(value, key)}
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

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            </Flex>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Add Item
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default ListSection;
