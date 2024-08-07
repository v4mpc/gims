import {
    Button,
    Checkbox,
    Collapse,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Select,
    Space, Tag,
} from "antd";
import { API_ROUTES, getLookupData, toCustomerCars } from "../../utils.jsx";
import { useQueries } from "@tanstack/react-query";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const CreatePaint = () => {
  const [form] = Form.useForm();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payViaInsurance, setPayViaInsurance] = useState(false);

  const results = useQueries({
    queries: [
      {
        queryKey: ["customerAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.customersAll),
      },

      {
        queryKey: ["paymentCatalogAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.paymentCatalogAll),
      },
    ],
  });
  const [customerQuery, paymentCatalogQuery] = results;
  const customers = toCustomerCars(customerQuery.data);

  const customFilter = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  const onSelectChange = (value) => {
    const filteredCustomer = customers.filter(
      (c) => Number(c.id) === Number(value),
    )[0];
    form.setFieldsValue({
      customerName: filteredCustomer.customerName,
      plateNumber: filteredCustomer.plateNumber,
      make: filteredCustomer.make,
      model: filteredCustomer.model,
    });
  };

  const onPriceChange = (e, key) => {
    const _paints = form.getFieldValue("paints");

    if (_paints[key].quantity) {
      form.setFieldsValue({
        paints: _paints.map((s, index) =>
          index === key
            ? {
                ...s,
                total: e * _paints[key].quantity,
              }
            : s,
        ),
      });
    }
  };

  const onQuantityChange = (e, key) => {
    const paints = form.getFieldValue("paints");
    if (paints[key].price) {
      form.setFieldsValue({
        paints: paints.map((s, index) =>
          index === key
            ? {
                ...s,
                total: e * paints[key].price,
              }
            : s,
        ),
      });
    }
  };

  const onPaymentChanged = (paymentId) => {
    const selectedPayment = paymentCatalogQuery.data.filter(
      (pc) => pc.id === paymentId,
    )[0];
    setSelectedPayment(selectedPayment);

    if (selectedPayment.accountNumber !== null) {
      form.setFieldsValue({
        accountNumber: selectedPayment.accountNumber,
      });
    }
  };

  const onPayViaInsuranceChanged = (e) => {
    setPayViaInsurance(e.target.checked);
  };

  const onValuesChanged = (changedValues, allValues) => {
    if (Object.hasOwn(changedValues, "paints")) {
      const totalQuantity = allValues.paints.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue?.quantity * currentValue?.price;
        },
        0,
      );

      form.setFieldsValue({
        grandTotal: isNaN(totalQuantity) ? 0 : totalQuantity,
      });

      console.log(totalQuantity);
    }
  };

  const collapseItems = [
    {
      key: "1",
      label: "Amount Details",
      children: (
        <>
          <Space wrap>
            <Form.Item name="estimateAmount" label="Estimate amount">
              <InputNumber
                style={{
                  width: "200px",
                }}
              />
            </Form.Item>

            <Form.Item name="grandTotal" label="Actual amount">
              <InputNumber style={{ width: "300px" }} disabled={true} />
            </Form.Item>

            <Form.Item name="netProfit" label="Net Profit">
              <InputNumber style={{ width: "300px" }} disabled={true} />
            </Form.Item>
          </Space>
        </>
      ),
    },
  ];

  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={onValuesChanged}
    >

        <Flex justify="flex-end">
            <Tag color="success">Paid</Tag>
            <Tag color="error">Discarded</Tag>
            <Tag color="warning">Unpaid</Tag>
        </Flex>
      <Divider orientation="left" plain>
        Customer car
      </Divider>
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
          name="carId"
        >
          <Select
            placeholder="Select customer vehicle"
            loading={customerQuery.isLoading}
            style={{ width: "400px" }}
            showSearch
            onChange={onSelectChange}
            filterOption={customFilter}
            options={customers.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item name="customerName" label="Customer name">
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="plateNumber" label="Vehicle plate number">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="make" label="Vehicle make">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="model" label="Vehicle model">
          <Input disabled={true} />
        </Form.Item>
      </Flex>

      <Divider orientation="left" plain>
        Items
      </Divider>

      <Form.List
        name="paints"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error("At least 1 Item required"));
              }
            },
          },
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
                    {
                      required: true,
                      message: "Missing price",
                    },
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
                    {
                      required: true,
                      message: "Missing price",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "150px" }}
                    onChange={(value) => onPriceChange(value, key)}
                    placeholder="Price"
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "quantity"]}
                  label={key === 0 ? "Quantity" : ""}
                  rules={[
                    {
                      required: true,
                      message: "Missing quantity",
                    },
                  ]}
                >
                  <InputNumber
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
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add Item
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Collapse
        style={{
          marginBottom: "20px",
        }}
        items={collapseItems}
        defaultActiveKey={["1"]}
      />

      <Flex justify="space-between" wrap>
        <Form.Item
          label="Payment method"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
          name="payment"
        >
          <Select
            placeholder="Select Payment"
            loading={paymentCatalogQuery.isLoading}
            style={{ width: "350px" }}
            showSearch
            onChange={onPaymentChanged}
            filterOption={customFilter}
            options={paymentCatalogQuery.data.map((c) => ({
              value: c.id,
              label: c.accountName,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item
          name="accountNumber"
          hidden={selectedPayment?.accountNumber === null}
          label="Account number"
        >
          <Input
            style={{
              width: "200px",
            }}
            disabled={true}
          />
        </Form.Item>

        <Form.Item
          name="active"
          valuePropName="checked"
          hidden={!selectedPayment?.insurance}
          label="Pay via insurance"
        >
          <Checkbox onChange={onPayViaInsuranceChanged} />
        </Form.Item>

        <Form.Item label="Date of payment" name="paymentDate">
          <DatePicker
            style={{
              width: "200px",
            }}
          />
        </Form.Item>

        <Form.Item name="grandTotal" label="Grand Total">
          <Input style={{ width: "300px" }} disabled={true} />
        </Form.Item>
      </Flex>

      {payViaInsurance && (
        <>
          <Divider orientation="left" plain>
            Insurance details
          </Divider>

          <Space wrap>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please enter insurance",
                },
              ]}
              name="insuranceName"
              label="Insurance name"
            >
              <Input style={{ width: "400px" }} />
            </Form.Item>
          </Space>
        </>
      )}
    </Form>
  );
};

export default CreatePaint;
