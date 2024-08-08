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
  Space,
  Tag,
} from "antd";
import {
  API_ROUTES,
  getLookupData,
  thousanSeparatorformatter,
  thousanSeparatorparser,
  toCustomerCars,
} from "../../utils.jsx";
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
  const [finalPaymentEnabled, setFinalPaymentEnabled] = useState(false);
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);

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
    const [filteredCustomer] = customers.filter(
      (c) => Number(c.id) === Number(value),
    );
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
    const _paints = form.getFieldValue("paints");
    if (_paints[key].price) {
      form.setFieldsValue({
        paints: _paints.map((s, index) =>
          index === key
            ? {
                ...s,
                total: e * _paints[key].price,
              }
            : s,
        ),
      });
    }
  };

  const onPaymentChanged = (paymentId) => {
    const [selectedPayment] = paymentCatalogQuery.data.filter(
      (pc) => pc.id === paymentId,
    );
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
    if (allValues.estimateAmount != null) {
      form.setFieldsValue({
        netProfit: allValues.estimateAmount - allValues.grandTotal,
      });
    }

    if (Object.hasOwn(changedValues, "paints")) {
      const totalQuantity = allValues.paints.reduce(
        (accumulator, currentValue) => {
          return (
            accumulator +
            (currentValue?.quantity ?? 0) * (currentValue?.price ?? 0)
          );
        },
        0,
      );
      form.setFieldsValue({
        grandTotal: isNaN(totalQuantity) ? 0 : totalQuantity,
      });
    }
  };

  const saveForLater = () => {
    setSaveOnlyValidation(true);

    form.setFields([
      {
        name: "paints",
        errors: [], // Clear any existing errors
      },
      {
        name: "initialPayment",
        errors: [],
      },


        {
            name: "initialPaymentDate",
            errors: [],
        },


        {
            name: "finalPaymentDate",
            errors: [],
        },
    ]);

    const fields = form.getFieldValue("paints") || [];
    // TODO understand flatmap
    form.setFields(
      fields.flatMap((_, index) => [
        { name: ["paints", index, "item"], errors: [] },
        { name: ["paints", index, "price"], errors: [] },
        { name: ["paints", index, "quantity"], errors: [] },
      ]),
    );

    setTimeout(() => {
      form
        .validateFields()
        .then((values) => {
          console.log("Form values:", values);
        })
        .catch((errorInfo) => {
          console.error("Validation failed:", errorInfo);
        });
    }, 0);
  };

  const finalize = async () => {
    setSaveOnlyValidation(false);
    setTimeout(() => {
      form
        .validateFields()
        .then((values) => {
          console.log("Form values:", values);
        })
        .catch((errorInfo) => {
          console.error("Validation failed:", errorInfo);
        });
    }, 0);
  };

  

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
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      layout="vertical"
      initialValues={{
        initialPayment: 0,
        finalPayment: 0,
        grandTotal: 0,
        netProfit: 0,
      }}
      autoComplete="off"
      onValuesChange={onValuesChanged}
    >
      <Flex justify="flex-end">
        <Tag color="success">Paid</Tag>
        <Tag color="error">Discarded</Tag>
        <Tag color="warning">Unpaid</Tag>
        <Tag color="warning">Partial Paid</Tag>
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

      <Divider orientation="left" plain>
        Payments
      </Divider>

      <div>
        <Space>
          <Form.Item
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (saveOnlyValidations) {
                    return Promise.resolve();
                  }


                  if (
                    value &&
                    getFieldValue("initialPayment") +
                      getFieldValue("finalPayment") >=
                      getFieldValue("estimateAmount")
                  ) {
                    return Promise.resolve();
                  }
                    console.log('am here');
                  return Promise.reject(

                    new Error(
                      "Payments should be greater on equal to Estimate amount to finalize.",
                    ),
                  );
                },
              }),
            ]}
            name="initialPayment"
            label="Initial Payment"
          >
            <InputNumber
              formatter={thousanSeparatorformatter}
              parser={thousanSeparatorparser}
              style={{ width: "300px" }}
              min={0}
            />
          </Form.Item>

          <Form.Item
              rules={[
                  ...(saveOnlyValidations
                      ? []
                      : [{ required: true, message: "Please select date" }]),
              ]}


              label="Date" name="initialPaymentDate">
            <DatePicker
              style={{
                width: "200px",
              }}
            />
          </Form.Item>
        </Space>
      </div>

      <div>
        <Space>
          <Form.Item
            dependencies={["initialPayment", "initialPaymentDate"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    (getFieldValue("initialPayment") &&
                      getFieldValue("initialPaymentDate"))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please fill initial Payment and date first"),
                  );
                },
              }),
            ]}
            name="finalPayment"
            label="Final Payment"
          >
            <InputNumber
              formatter={thousanSeparatorformatter}
              parser={thousanSeparatorparser}
              min={0}
              style={{ width: "300px" }}
            />
          </Form.Item>

          <Form.Item
              rules={[
                  ({ getFieldValue }) => ({
                      validator(_, value) {
                          if (saveOnlyValidations) {
                              return Promise.resolve();
                          }

                          if (

                              !value && getFieldValue("finalPayment")

                          ) {
                              return Promise.reject(

                                  new Error(
                                      "Please select date",
                                  ),
                              );

                          }

                          return Promise.resolve();
                      },
                  }),
              ]}


              label="Date" name="finalPaymentDate">
            <DatePicker
              style={{
                width: "200px",
              }}
            />
          </Form.Item>
        </Space>
      </div>

      <Divider orientation="left" plain>
        Payment method
      </Divider>

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

        <Form.Item name="grandTotal" label="Grand Total">
          <InputNumber
            formatter={thousanSeparatorformatter}
            parser={thousanSeparatorparser}
            style={{ width: "300px" }}
            disabled={true}
          />
        </Form.Item>
      </Flex>

      {payViaInsurance && selectedPayment?.insurance && (
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


        <Divider orientation="left" plain/>

      <Flex justify="space-between">
        <Space>
          <Button htmlType="button">Cancel</Button>

          <Button htmlType="button" onClick={form.resetFields}>
            Reset
          </Button>
        </Space>
        <Space>
          <Button type="dashed" onClick={finalize} htmlType="button">
            Print invoice
          </Button>

          <Button type="primary" onClick={saveForLater} htmlType="button">
            Save for later
          </Button>

          <Button type="primary" htmlType="button" onClick={finalize}>
            Finalize
          </Button>
        </Space>
      </Flex>
    </Form>
  );
};

export default CreatePaint;
